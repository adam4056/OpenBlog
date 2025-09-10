import os
import markdown

SRC_DIR = "src"
ARTICLES_SRC = os.path.join(SRC_DIR, "articles")
TEMPLATE_FILE = os.path.join(SRC_DIR, "template.html")
INDEX_TEMPLATE_FILE = os.path.join(SRC_DIR, "index_template.html")

PUBLIC_DIR = "public"
ARTICLES_PUBLIC = os.path.join(PUBLIC_DIR, "articles")

# -------------------------------
# Helper functions
# -------------------------------
def load_template(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def parse_metadata_and_content(md_path):
    with open(md_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    if not lines:
        return "", "", "", ""

    meta_line = lines[0].strip()
    body_lines = lines[1:]

    date, time, author = "", "", ""
    if meta_line.startswith("!!!") and meta_line.endswith("!!!"):
        parts = meta_line.strip("!").split("!!")
        if len(parts) >= 3:
            date, time, author = parts[0], parts[1], parts[2]

    return date, time, author, "".join(body_lines)

def render_article(md_path, template):
    date, time, author, md_content = parse_metadata_and_content(md_path)
    html_content = markdown.markdown(md_content, extensions=["fenced_code", "tables"])
    title = os.path.splitext(os.path.basename(md_path))[0]

    html = (
        template.replace("{{ title }}", title)
                .replace("{{ date }}", date)
                .replace("{{ time }}", time)
                .replace("{{ author }}", author)
                .replace("{{ content }}", html_content)
    )
    return html, title, date, time, author

# -------------------------------
# Generate article HTML
# -------------------------------
def build_articles():
    template = load_template(TEMPLATE_FILE)
    os.makedirs(ARTICLES_PUBLIC, exist_ok=True)

    articles_data = []

    for file in os.listdir(ARTICLES_SRC):
        if file.endswith(".md"):
            md_path = os.path.join(ARTICLES_SRC, file)
            html, title, date, time, author = render_article(md_path, template)

            out_name = file.replace(".md", ".html")
            out_path = os.path.join(ARTICLES_PUBLIC, out_name)
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(html)

            print(f"✅ {file} → {out_name}")

            # save metadata for index
            articles_data.append({
                "title": title,
                "date": date,
                "time": time,
                "author": author,
                "url": f"articles/{out_name}"
            })

    return articles_data

# -------------------------------
# Generate index.html
# -------------------------------
def build_index(articles):
    template = load_template(INDEX_TEMPLATE_FILE)

    articles_html = []
    for art in articles:
        articles_html.append(
            f'<a href="{art["url"]}" class="block p-4 bg-white rounded-xl shadow hover:bg-gray-50">'
            f'<h3 class="text-xl font-bold">{art["title"]}</h3>'
            f'<p class="text-gray-500 text-sm">{art["date"]} {art["time"]} · {art["author"]}</p>'
            f'</a>'
        )

    output = template.replace("{{articles}}", "\n".join(articles_html))

    index_path = os.path.join(PUBLIC_DIR, "index.html")
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(output)

    print("✅ index.html ready")

# -------------------------------
# Main
# -------------------------------
def main():
    articles = build_articles()
    build_index(articles)
    print("🎉 Build complete!")

if __name__ == "__main__":
    main()
