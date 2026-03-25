import { useState, useEffect } from 'react';

export const useArticles = () => {
  const [articles, setArticles] = useState([
    {
      slug: "my-word-article",
      title: "Title of My Word Document",
      date: "2026-03-25",
      excerpt: "Short summary of the article...",
      readTime: "5 min read",
      fileUrl: "/articles/sbp_equity_article.docx" // Path to the file
    }
  ]);
  const [loading, setLoading] = useState(false);

  return { articles, loading };
};