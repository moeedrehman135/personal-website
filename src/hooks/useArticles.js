import { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// Simple frontmatter parser (no gray-matter needed)
function parseFrontmatter(text) {
  const lines = text.split('\n');
  
  // Check if starts with ---
  if (lines[0] !== '---') {
    return { data: {}, content: text };
  }

  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return { data: {}, content: text };
  }

  const frontmatterLines = lines.slice(1, endIndex);
  const content = lines.slice(endIndex + 1).join('\n');

  const data = {};
  for (const line of frontmatterLines) {
    if (!line.trim()) continue;
    
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // Parse booleans
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    
    data[key] = value;
  }

  return { data, content };
}

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        // Fetch the markdown file
        const response = await fetch('/articles/gender-labor-market.md');
        
        if (!response.ok) {
          throw new Error(`Failed to load article: ${response.status} ${response.statusText}`);
        }

        const markdown = await response.text();
        console.log('✓ File fetched successfully');

        // Parse frontmatter and content
        const { data, content } = parseFrontmatter(markdown);
        console.log('✓ Frontmatter parsed:', data);

        // Convert markdown to HTML
        const html = md.render(content);
        console.log('✓ Markdown converted to HTML');

        const article = {
          id: data.id || 1,
          title: data.title || 'Untitled',
          subtitle: data.subtitle || '',
          date: data.date || new Date().toISOString(),
          readTime: data.readTime || '5 min read',
          author: data.author || 'Anonymous',
          excerpt: data.excerpt || '',
          category: data.category || 'General',
          featured: data.featured !== false && data.featured !== 'false',
          slug: 'gender-labor-market',
          html: html,
          content: content,
          frontmatter: data,
        };

        console.log('✓ Article object created:', article.title);
        setArticles([article]);
        setError(null);
      } catch (err) {
        console.error('✗ Error loading articles:', err.message);
        setError(err.message);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  return { articles, loading, error };
};