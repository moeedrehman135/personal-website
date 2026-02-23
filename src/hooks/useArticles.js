import { useState, useEffect } from 'react';

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        // Import all markdown files from src/articles
        const articleModules = import.meta.glob('../articles/*.md', { 
          as: 'raw',
          eager: true 
        });

        const loadedArticles = Object.entries(articleModules).map(([path, content]) => {
          // Extract frontmatter and content
          const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
          const match = content.match(frontmatterRegex);

          if (!match) {
            console.warn(`No frontmatter found in ${path}`);
            return null;
          }

          const [, frontmatter, markdown] = match;
          
          // Parse frontmatter
          const meta = {};
          frontmatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
              meta[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
            }
          });

          // Get slug from filename
          const slug = path.split('/').pop().replace('.md', '');

          // Convert markdown to HTML with better parsing
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
        }).filter(Boolean);

        // Sort by date (newest first)
        loadedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

        setArticles(loadedArticles);
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

// Enhanced markdown parser
function parseMarkdown(markdown) {
  let html = markdown;

  // Convert images first (before paragraphs)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    return `<img src="${src}" alt="${alt}" class="w-full rounded-2xl my-8 border border-white/10" />`;
  });

  // Convert headings
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-2xl font-semibold text-white mt-12 mb-4">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-4xl font-semibold text-white mt-16 mb-6">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-5xl font-semibold text-white mt-12 mb-8">$1</h1>');

  // Convert bold text
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline">$1</a>');

  // Convert unordered lists
  html = html.replace(/^\s*[-*]\s+(.+)$/gm, '<li class="ml-6 mb-2">$1</li>');
  html = html.replace(/(<li class="ml-6 mb-2">.*<\/li>\n?)+/g, (match) => {
    return `<ul class="list-disc list-outside space-y-2 my-6">${match}</ul>`;
  });

  // Convert ordered lists
  html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="ml-6 mb-2">$1</li>');
  html = html.replace(/(<li class="ml-6 mb-2">.*<\/li>\n?)+/g, (match) => {
    // Check if it's already wrapped in ul (from unordered list)
    if (!match.includes('<ul')) {
      return `<ol class="list-decimal list-outside space-y-2 my-6">${match}</ol>`;
    }
    return match;
  });

  // Convert blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-neutral-600 pl-4 italic text-neutral-400 my-6">$1</blockquote>');

  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-neutral-900 text-orange-400 px-2 py-1 rounded text-sm">$1</code>');

  // Convert paragraphs (anything not already wrapped)
  html = html.split('\n\n').map(block => {
    // Skip if already HTML
    if (block.trim().startsWith('<')) {
      return block;
    }
    // Skip empty blocks
    if (block.trim() === '') {
      return '';
    }
    // Wrap in paragraph
    return `<p class="text-neutral-300 leading-relaxed mb-6">${block.trim()}</p>`;
  }).join('\n');

  return html;
}