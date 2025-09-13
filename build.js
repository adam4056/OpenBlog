const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

// Configuration
const SRC_DIR = 'src';
const ARTICLES_SRC = 'articles'; // articles moved to root
const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
const TEMPLATE_FILE = path.join(TEMPLATES_DIR, 'template.html');
const INDEX_TEMPLATE_FILE = path.join(TEMPLATES_DIR, 'index_template.html');

const PUBLIC_DIR = 'public';
const ARTICLES_PUBLIC = path.join(PUBLIC_DIR, 'articles');

// Initialize markdown parser
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// -------------------------------
// Helper functions
// -------------------------------
function loadTemplate(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function parseMetadataAndContent(mdPath) {
  const content = fs.readFileSync(mdPath, 'utf8');
  const lines = content.split('\n');

  if (lines.length === 0) {
    return { date: '', time: '', author: '', content: '' };
  }

  const metaLine = lines[0].trim();
  const bodyLines = lines.slice(1);

  let date = '', time = '', author = '';
  if (metaLine.startsWith('!!!') && metaLine.endsWith('!!!')) {
    const parts = metaLine.slice(3, -3).split('!!');
    if (parts.length >= 3) {
      date = parts[0];
      time = parts[1];
      author = parts[2];
    }
  }

  return {
    date,
    time,
    author,
    content: bodyLines.join('\n')
  };
}

function renderArticle(mdPath, template) {
  const { date, time, author, content } = parseMetadataAndContent(mdPath);
  const htmlContent = md.render(content);
  const title = path.basename(mdPath, '.md');

  const html = template
    .replace(/\{\{\s*title\s*\}\}/g, title)
    .replace(/\{\{\s*date\s*\}\}/g, date)
    .replace(/\{\{\s*time\s*\}\}/g, time)
    .replace(/\{\{\s*author\s*\}\}/g, author)
    .replace(/\{\{\s*content\s*\}\}/g, htmlContent);

  return { html, title, date, time, author };
}

// -------------------------------
// Generate article HTML
// -------------------------------
function buildArticles() {
  const template = loadTemplate(TEMPLATE_FILE);
  
  // Ensure articles directory exists
  if (!fs.existsSync(ARTICLES_PUBLIC)) {
    fs.mkdirSync(ARTICLES_PUBLIC, { recursive: true });
  }

  const articlesData = [];
  const files = fs.readdirSync(ARTICLES_SRC);

  for (const file of files) {
    if (file.endsWith('.md')) {
      const mdPath = path.join(ARTICLES_SRC, file);
      const { html, title, date, time, author } = renderArticle(mdPath, template);

      const outName = file.replace('.md', '.html');
      const outPath = path.join(ARTICLES_PUBLIC, outName);
      fs.writeFileSync(outPath, html, 'utf8');

      console.log(`✅ ${file} → ${outName}`);

      // Save metadata for index
      articlesData.push({
        title,
        date,
        time,
        author,
        url: `articles/${outName}`
      });
    }
  }

  return articlesData;
}

// -------------------------------
// Generate index.html
// -------------------------------
function buildIndex(articles) {
  const template = loadTemplate(INDEX_TEMPLATE_FILE);

  const articlesHtml = articles.map(art => 
    `<article class="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
        <h3 class="text-xl font-bold text-gray-900 mb-2">
          <a href="${art.url}" class="hover:underline">${art.title}</a>
        </h3>
        <p class="text-gray-500 text-sm mb-3">${art.date} · ${art.author} · ${art.time} read</p>
        <a href="${art.url}" class="text-blue-600 font-medium hover:underline">Read more →</a>
    </article>`
  ).join('\n');
  
  const output = template
    .replace(/\{\{\s*articles\s*\}\}/g, articlesHtml)
    .replace(/\{\{\s*articles_count\s*\}\}/g, articles.length);
  
  // Write the generated HTML to public/index.html
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  fs.writeFileSync(indexPath, output, 'utf8');
  console.log(`✅ index.html generated with ${articles.length} articles`);
}

// -------------------------------
// Main
// -------------------------------
function main() {
  try {
    console.log('🚀 Starting build process...');
    
    const articles = buildArticles();
    buildIndex(articles);
    
    console.log('🎉 Build complete!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { buildArticles, buildIndex, main };