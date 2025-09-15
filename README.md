# Modern Blog

A simple, static blog generator built with Node.js and Tailwind CSS. This project automatically converts Markdown articles into a beautiful, responsive website.

## Features

- 📝 **Markdown Support**: Write articles in Markdown format
- 🎨 **Modern Design**: Beautiful, responsive UI with Tailwind CSS
- ⚡ **Fast Build**: Quick static site generation
- 🔄 **Auto-reload**: Development mode with file watching
- 📱 **Mobile-friendly**: Responsive design that works on all devices
- 🏷️ **Metadata Support**: Add date, time, and author information to articles

## Project Structure

```
blog/
├── articles/              # Markdown articles
│   └── *.md              # Article files
├── src/
│   ├── templates/        # HTML templates
│   │   ├── template.html # Article template
│   │   └── index_template.html # Homepage template
│   └── input.css         # Tailwind CSS input
├── public/               # Generated website
│   ├── articles/         # Generated article HTML files
│   ├── index.html        # Generated homepage
│   └── output.css        # Generated CSS
├── build.js              # Node.js build script
└── package.json          # Node.js dependencies
```

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

## Quick Start (GitHub Pages)

### 🚀 One-Click Setup

1. **Fork this repository** on GitHub
2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: "GitHub Actions"
3. **Add your first article**:
   ```bash
   # Clone your fork
   git clone https://github.com/adam4056/OpenBlog.git
   cd blog
   
   # Add an article
   echo "!!!$(date +%Y/%m/%d)!!$(date +%H:%M)!!Your Name!!

   # My First Post

   Hello world! This is my first blog post." > articles/my-first-post.md
   
   # Push to trigger deployment
   git add .
   git commit -m "Add first article"
   git push
   ```
4. **Your blog is live!** Visit: `https://YOUR_USERNAME.github.io/blog`

## Installation

### Option 1: GitHub Pages with GitHub Actions (Recommended)

This option automatically builds and deploys your blog whenever you push changes to the repository.

1. **Fork or clone this repository**
   ```bash
   git clone https://github.com/yourusername/blog.git
   cd blog
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "GitHub Actions"

3. **GitHub Actions will automatically build and deploy**
   - The included workflow (`.github/workflows/deploy.yml`) will:
     - Install Node.js and dependencies
     - Build the blog (CSS + articles)
     - Deploy to GitHub Pages
   - Your blog will be available at: `https://yourusername.github.io/blog`

4. **Add your articles**
   - Simply add `.md` files to the `articles/` directory
   - Push changes to trigger automatic deployment
   - Your blog updates automatically!

### Option 2: Local Development

If you want to work on this project locally:

```bash
# Navigate to your project directory
cd /path/to/your/blog

# Install dependencies
npm install

# Start development mode
npm run dev
```

## Usage

### Development Mode

Start the development server with auto-reload:

```bash
npm run dev
```

This will:
- Watch for changes in `articles/` and `src/templates/`
- Automatically rebuild when files change
- Watch for CSS changes and rebuild styles

### Build for Production

Generate the static website:

```bash
npm run build
```

This will:
- Compile Tailwind CSS
- Convert all Markdown articles to HTML
- Generate the homepage with article listings
- Output everything to the `public/` directory

### Individual Commands

```bash
# Build only CSS
npm run build:css

# Build only articles
npm run build:articles

# Watch CSS changes
npm run dev:css

# Watch article changes
npm run dev:articles
```

## Writing Articles

### Article Format

Create new articles in the `articles/` directory as `.md` files. Each article should start with metadata:

```markdown
!!!Date!!Time!!Author!!!

# Your Article Title

Your article content goes here...

## Subheading

More content...
```

### Metadata Format

The first line of each article must follow this format:
```
!!!YYYY/MM/DD!!HH:MM!!Author Name!!!
```

Example:
```markdown
!!!2024/12/25!!14:30!!John Doe!!!

# My First Article

This is the content of my article...
```

### Supported Markdown

The blog supports standard Markdown features:
- Headers (`#`, `##`, `###`)
- **Bold** and *italic* text
- `Code blocks` and `inline code`
- Lists (ordered and unordered)
- Links and images
- Tables
- Blockquotes

## Customization

### Styling

Edit `src/input.css` to customize the Tailwind CSS configuration:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom styles here */
```

### Templates

Modify the HTML templates in `src/templates/`:

- `template.html` - Individual article template
- `index_template.html` - Homepage template

Template variables:
- `{{ title }}` - Article title
- `{{ date }}` - Article date
- `{{ time }}` - Article time
- `{{ author }}` - Article author
- `{{ content }}` - Article content (HTML)
- `{{ articles }}` - Article listings (index only)
- `{{ articles_count }}` - Number of articles (index only)

## GitHub Actions Workflow

The project includes an automated deployment workflow. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Blog to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build blog
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './public'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Deployment

### Automatic Deployment (GitHub Pages + Actions)

The easiest way to deploy your blog:

1. **Push to GitHub**: Your code is automatically built and deployed
2. **No manual steps required**: Just add articles and push changes
3. **Live updates**: Your blog updates automatically on every push

### Manual Deployment

If you prefer manual deployment:

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Deploy the `public/` folder** to any static hosting service:
   - **Netlify**: Drag and drop the `public/` folder
   - **Vercel**: Connect your GitHub repository
   - **AWS S3**: Upload the `public/` folder
   - **Any web server**: Copy `public/` contents to your web root
```

## Troubleshooting

### Common Issues

1. **Articles not building**: Check that your Markdown files are in the `articles/` directory
2. **CSS not loading**: Run `npm run build:css` to generate the CSS file
3. **Template errors**: Ensure your metadata format is correct (`!!!Date!!Time!!Author!!!`)
4. **File watching not working**: Make sure you're in the project root directory

### Dependencies

If you encounter issues, try reinstalling dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainer.
