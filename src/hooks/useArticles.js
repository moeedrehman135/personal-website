import { useState, useEffect } from 'react';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        // Get all markdown files from articles folder
        const articleContext = require.context(
          '../articles',
          false,
          /\.md$/
        );

        const files = articleContext.keys();
        const loadedArticles = [];

        // Process each markdown file
        for (const file of files) {
          const module = await import(`../articles/${file.slice(2)}`);
          const markdown = module.default;

          // Parse frontmatter and content
          const { data, content } = matter(markdown);

          // Convert markdown to HTML
          const html = md.render(content);

          loadedArticles.push({
            id: data.id || Date.now(),
            title: data.title || 'Untitled',
            subtitle: data.subtitle || '',
            date: data.date || new Date().toISOString(),
            readTime: data.readTime || '5 min read',
            author: data.author || 'Anonymous',
            excerpt: data.excerpt || '',
            category: data.category || 'General',
            featured: data.featured || false,
            slug: file.slice(2, -3), // Remove './' and '.md'
            html: html,
            content: content,
            frontmatter: data,
          });
        }

        // Sort by date (newest first)
        loadedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Put featured articles first
        const featured = loadedArticles.filter(a => a.featured);
        const others = loadedArticles.filter(a => !a.featured);
        setArticles([...featured, ...others]);

        setError(null);
      } catch (err) {
        console.error('Error loading articles:', err);
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