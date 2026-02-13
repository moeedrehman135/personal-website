import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ArrowUpRight, ArrowLeft, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import matter from 'gray-matter';

/* =========================
   LOAD MARKDOWN ARTICLES (VITE)
========================= */

function loadArticles() {
  const modules = import.meta.glob('./articles/*.md', {
    eager: true,
    as: 'raw'
  });

  const articles = Object.entries(modules).map(([path, fileContent], index) => {
    const { data, content } = matter(fileContent);

    return {
      id: index,
      ...data,
      content
    };
  });

  return articles.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
}

/* =========================
   ARTICLE DETAIL COMPONENT
========================= */

const ArticleDetail = ({ article, onBack }) => {
  return (
    <div className="animate-fadeIn">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors mb-16 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Articles</span>
      </button>

      <article className="max-w-2xl">
        <div className="mb-8">
          <div className="flex gap-6 text-sm text-neutral-500 mb-6">
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {article.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold text-white mb-6 leading-tight tracking-tight">
            {article.title}
          </h1>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

/* =========================
   MAIN PORTFOLIO
========================= */

const Portfolio = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [articles] = useState(loadArticles());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const path = currentPage === 'home' ? '/' : `/${currentPage}`;
    window.history.pushState({}, '', path);
  }, [currentPage]);

  const projects = [
    {
      title: "Distributed Task Scheduler",
      description: "Fault-tolerant distributed system for task scheduling using Go and Redis.",
      tech: ["Go", "Redis", "Docker", "gRPC"],
      github: "https://github.com/moeedrehman135/task-scheduler",
      demo: "#"
    }
  ];

  const experience = [
    {
      role: "Software Engineering Intern",
      company: "Tech Company",
      period: "Summer 2025",
      description: "Developed microservices for payment processing."
    }
  ];

  const skills = {
    Languages: ["Python", "JavaScript", "Java", "Go", "C++"],
    Frameworks: ["React", "Node.js", "Django"],
    Tools: ["Git", "Docker", "AWS"]
  };

  const navigate = (page) => {
    setCurrentPage(page);
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">

      {/* NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <button onClick={() => navigate('home')} className="text-xl font-semibold">
            Moeed Rehman
          </button>

          <div className="flex gap-2">
            {['home', 'projects', 'articles', 'experience'].map(page => (
              <button
                key={page}
                onClick={() => navigate(page)}
                className={`px-4 py-2 rounded-full text-sm ${
                  currentPage === page ? 'bg-white text-black' : 'text-neutral-400'
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-40 pb-32">

        {/* ARTICLES LIST */}
        {currentPage === 'articles' && !selectedArticle && (
          <div className="space-y-6">
            <h2 className="text-6xl font-semibold">Articles</h2>

            {articles.map(article => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="w-full text-left border border-white/10 rounded-3xl p-10 hover:border-white/20 transition-colors"
              >
                <h3 className="text-3xl font-semibold">{article.title}</h3>
                <p className="text-neutral-400 mt-4">{article.excerpt}</p>
                <div className="text-sm text-neutral-500 mt-4">
                  {article.date} · {article.readTime}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ARTICLE DETAIL */}
        {currentPage === 'articles' && selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
          />
        )}

      </main>
    </div>
  );
};

export default Portfolio;
