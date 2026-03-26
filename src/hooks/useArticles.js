import { useState, useEffect } from 'react';
import mammoth from 'mammoth';

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const loaded = [];

        // --- Load .md files (existing logic) ---
        const mdModules = import.meta.glob('../articles/*.md', { as: 'raw', eager: true });
        for (const [path, content] of Object.entries(mdModules)) {
          const article = parseMdArticle(path, content);
          if (article) loaded.push(article);
        }

        // --- Load .docx files ---
        const docxUrls = import.meta.glob('../articles/*.docx', { as: 'url', eager: true });
        for (const [path, url] of Object.entries(docxUrls)) {
          const article = await parseDocxArticle(path, url);
          if (article) loaded.push(article);
        }

        loaded.sort((a, b) => new Date(b.date) - new Date(a.date));
        setArticles(loaded);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  return { articles, loading };
};

// ---- .md parser (your existing logic, unchanged) ----
function parseMdArticle(path, content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  if (!match) return null;

  const [, frontmatter, markdown] = match;
  const meta = {};
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      meta[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });

  const slug = path.split('/').pop().replace('.md', '');
  const html = parseMarkdown(markdown);

  return {
    slug,
    title: meta.title || 'Untitled',
    date: meta.date || new Date().toISOString(),
    excerpt: meta.excerpt || '',
    readTime: meta.readTime || '5 min read',
    html,
    ...meta
  };
}

// ---- .docx parser ----
async function parseDocxArticle(path, url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    const result = await mammoth.convertToHtml({ arrayBuffer }, {
      styleMap: [
        "p[style-name='Heading 1'] => h1",
        "p[style-name='Heading 2'] => h2",
        "p[style-name='Heading 3'] => h3",
      ]
    });

    // Apply your site's CSS classes to the HTML elements
    let html = result.value;
    html = html.replace(/<h1>/g, '<h1 class="text-5xl font-semibold text-white mt-12 mb-8">');
    html = html.replace(/<h2>/g, '<h2 class="text-4xl font-semibold text-white mt-16 mb-6">');
    html = html.replace(/<h3>/g, '<h3 class="text-2xl font-semibold text-white mt-12 mb-4">');
    html = html.replace(/<p>/g, '<p class="text-neutral-300 leading-relaxed mb-6">');
    html = html.replace(/<strong>/g, '<strong class="text-white font-semibold">');
    html = html.replace(/<a /g, '<a class="text-blue-400 hover:text-blue-300 underline" ');
    html = html.replace(/<ul>/g, '<ul class="list-disc list-outside space-y-2 my-6 ml-6">');
    html = html.replace(/<ol>/g, '<ol class="list-decimal list-outside space-y-2 my-6 ml-6">');
    html = html.replace(/<blockquote>/g, '<blockquote class="border-l-4 border-neutral-600 pl-4 italic text-neutral-400 my-6">');
    html = html.replace(/<code>/g, '<code class="bg-neutral-900 text-orange-400 px-2 py-1 rounded text-sm">');
    html = html.replace(/<img /g, '<img class="w-full rounded-2xl my-8 border border-white/10" ');

    // Derive title from filename (e.g. "my-article.docx" → "My Article")
    const slug = path.split('/').pop().replace('.docx', '');
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Try to extract title from first <h1> if present
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/);
    const extractedTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '') : title;

    return {
      slug,
      title: extractedTitle,
      date: new Date().toISOString(), // docx has no frontmatter; customize as needed
      excerpt: extractPlainText(result.value).slice(0, 200) + '...',
      readTime: estimateReadTime(result.value),
      html,
    };
  } catch (err) {
    console.error(`Failed to load docx: ${path}`, err);
    return null;
  }
}

function extractPlainText(html) {
  return html.replace(/<[^>]+>/g, '').trim();
}

function estimateReadTime(html) {
  const words = extractPlainText(html).split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

// ---- your existing markdown parser (unchanged) ----
function parseMarkdown(markdown) {
  // ... (keep your existing parseMarkdown function here)
}