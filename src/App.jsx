import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ArrowUpRight, ArrowLeft, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';


// Article Detail Page Component
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
          <div className="text-neutral-300 leading-relaxed space-y-6 text-lg">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-[1.8]">{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

function loadArticles() {
  const context = require.context('./articles', false, /\.md$/);
  
  return context.keys().map((key, index) => {
    const fileContent = context(key);
    const { data, content } = matter(fileContent.default);
    
    return {
      id: index,
      ...data,
      content
    };
  });
}


const Portfolio = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [scrolled, setScrolled] = useState(false);

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
      description: "Fault-tolerant distributed system for task scheduling using Go and Redis. Implements consensus algorithms for reliable task distribution across multiple nodes.",
      tech: ["Go", "Redis", "Docker", "gRPC"],
      github: "https://github.com/moeedrehman135/task-scheduler",
      demo: "https://demo.example.com"
    },
    {
      title: "Real-time Chat Application",
      description: "WebSocket-based chat application with end-to-end encryption and message persistence. Supports group chats, file sharing, and real-time presence indicators.",
      tech: ["React", "Node.js", "Socket.io", "MongoDB"],
      github: "https://github.com/moeedrehman135/chat-app",
      demo: "https://demo.example.com"
    },
    {
      title: "ML Image Classifier",
      description: "Convolutional neural network achieving 94% accuracy on custom dataset. Deployed with FastAPI backend and containerized for production environments.",
      tech: ["Python", "TensorFlow", "Flask", "Docker"],
      github: "https://github.com/moeedrehman135/ml-classifier",
      demo: "https://demo.example.com"
    }
  ];

  const articles = [
    {
      id: 1,
      title: "Understanding Consensus Algorithms in Distributed Systems",
      date: "January 15, 2026",
      readTime: "8 min read",
      excerpt: "Exploring Raft and Paxos algorithms and their practical applications in modern distributed systems.",
      content: `Distributed systems are the backbone of modern cloud infrastructure, but achieving consensus across multiple nodes remains one of computer science's most challenging problems.

In this article, we'll dive deep into two fundamental consensus algorithms: Raft and Paxos. While Paxos has been the theoretical foundation for decades, Raft has gained popularity for its understandability and practical implementation.

The CAP theorem tells us we can't have consistency, availability, and partition tolerance simultaneously. Consensus algorithms help us navigate these trade-offs intelligently.

Raft simplifies the problem by electing a leader who manages all client requests. This asymmetry makes the algorithm easier to understand and implement compared to Paxos's more symmetric approach.

We'll explore how these algorithms handle network partitions, leader elections, and log replication. Understanding these concepts is crucial for building reliable distributed systems that can withstand real-world failures.

Modern databases like etcd and Consul use Raft under the hood, while Google's Spanner uses a Paxos variant. Knowing when to use each algorithm can make the difference between a system that scales gracefully and one that fails under load.`
    },
    {
      id: 2,
      title: "Optimizing React Performance: A Deep Dive",
      date: "December 28, 2025",
      readTime: "6 min read",
      excerpt: "Advanced techniques to make your React applications blazing fast through memoization and code splitting.",
      content: `React's virtual DOM is powerful, but it's not magic. Without proper optimization, even simple applications can become sluggish as they grow.

The key to React performance lies in understanding when and why components re-render. Every state change triggers a re-render, but not every re-render needs to propagate through your entire component tree.

React.memo is your first line of defense. By memoizing components, you prevent unnecessary re-renders when props haven't changed. But be careful—premature optimization can make your code harder to maintain without meaningful performance gains.

useCallback and useMemo are equally important. Functions are recreated on every render, which can break memoization. Wrapping callbacks and expensive computations ensures referential equality across renders.

Code splitting with React.lazy and Suspense allows you to load components on demand. This dramatically reduces initial bundle size, especially important for mobile users on slower connections.

Virtual scrolling libraries like react-window can handle thousands of list items without performance degradation. Instead of rendering everything, they only render what's visible in the viewport.

Profile first, optimize second. Use React DevTools Profiler to identify actual bottlenecks before refactoring. Many perceived performance issues are actually caused by network latency or inefficient algorithms, not React itself.`
    },
    {
      id: 3,
      title: "Building Scalable APIs with GraphQL",
      date: "November 10, 2025",
      readTime: "10 min read",
      excerpt: "Why GraphQL is replacing REST for modern APIs and how to implement it effectively in production.",
      content: `REST has served us well for decades, but modern applications demand more flexibility. GraphQL solves the over-fetching and under-fetching problems that plague REST APIs.

With GraphQL, clients specify exactly what data they need. No more endpoints that return 80% unnecessary data or multiple round trips to assemble a single view.

The schema is your contract. It documents your API, enables powerful tooling, and catches errors at compile time. Tools like GraphQL Code Generator can create TypeScript types directly from your schema.

Resolvers are where the magic happens. Each field in your schema maps to a resolver function that knows how to fetch that data. This separation of concerns makes your API incredibly flexible.

DataLoader solves the N+1 query problem through batching and caching. Without it, a simple query could trigger hundreds of database calls. With it, you batch requests and cache results within a single request context.

Authentication and authorization in GraphQL require careful thought. Unlike REST where you can protect entire endpoints, GraphQL needs field-level security. Directives and middleware can enforce permissions at the resolver level.

Subscriptions bring real-time capabilities to GraphQL. Using WebSockets, clients can subscribe to data changes and receive updates instantly. This is perfect for chat applications, live dashboards, and collaborative tools.

Production GraphQL requires careful monitoring. Track query complexity, slow resolvers, and error rates. Tools like Apollo Studio provide observability into your GraphQL layer.`
    }

    
  ];

  const experience = [
    {
      role: "Software Engineering Intern",
      company: "Tech Company",
      period: "Summer 2025",
      description: "Developed microservices for payment processing, reducing transaction latency by 40%. Worked with Kubernetes and implemented comprehensive monitoring solutions."
    },
    {
      role: "Research Assistant",
      company: "University CS Lab",
      period: "2024 - Present",
      description: "Researching optimization algorithms for large-scale graph neural networks. Published findings in peer-reviewed conference proceedings."
    }
  ];

  const skills = {
    "Languages": ["Python", "JavaScript", "Java", "Go", "C++"],
    "Frameworks": ["React", "Node.js", "Django", "Spring Boot"],
    "Tools": ["Git", "Docker", "Kubernetes", "AWS", "PostgreSQL"]
  };

  const navigate = (page) => {
    setCurrentPage(page);
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate('home')}
              className="text-xl font-semibold tracking-tight text-white hover:text-neutral-400 transition-colors"
            >
              Moeed Rehman
            </button>
            
            <div className="flex gap-1">
              {[
                { page: 'home', label: 'Home' },
                { page: 'projects', label: 'Projects' },
                { page: 'articles', label: 'Articles' },
                { page: 'experience', label: 'Experience' }
              ].map(({ page, label }) => (
                <button
                  key={page}
                  onClick={() => navigate(page)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-white text-black'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 pt-40 pb-32">
        {/* Home Page */}
        {currentPage === 'home' && (
          <div className="animate-fadeIn space-y-32">
            <section className="max-w-4xl">
              <h1 className="text-7xl md:text-8xl font-semibold mb-8 leading-none tracking-tight">
                Hi, I'm Moeed
              </h1>
              <p className="text-2xl text-neutral-400 leading-relaxed max-w-3xl">
                Computer Science student passionate about building scalable systems and exploring 
                the intersection of distributed computing and machine learning.
              </p>
            </section>

            <section className="flex gap-3">
              <a 
                href="https://github.com/moeedrehman135" 
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-105 border border-white/10"
              >
                <Github size={20} className="text-white" />
              </a>
              <a 
                href="https://www.linkedin.com/in/moeed-rehman-abb025261/" 
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-105 border border-white/10"
              >
                <Linkedin size={20} className="text-white" />
              </a>
              <a 
                href="mailto:moeedrehman50eme@gmail.com" 
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-105 border border-white/10"
              >
                <Mail size={20} className="text-white" />
              </a>
            </section>

            <section className="space-y-16">
              <h2 className="text-sm uppercase tracking-widest text-neutral-500 font-medium">Technical Skills</h2>
              <div className="space-y-12">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-lg text-neutral-500 mb-4 font-medium">{category}</h3>
                    <div className="flex flex-wrap gap-3">
                      {items.map(skill => (
                        <span 
                          key={skill} 
                          className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-neutral-300 hover:bg-white/10 hover:border-white/20 transition-all"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Projects Page */}
        {currentPage === 'projects' && (
          <div className="animate-fadeIn space-y-16">
            <div>
              <p className="text-sm uppercase tracking-widest text-neutral-500 font-medium mb-4">Selected Work</p>
              <h2 className="text-6xl font-semibold tracking-tight">Projects</h2>
            </div>
            
            <div className="space-y-6">
              {projects.map((project, idx) => (
                <div 
                  key={idx} 
                  className="group relative bg-white/[0.02] border border-white/10 rounded-3xl p-10 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start gap-8">
                      <div className="flex-1">
                        <h3 className="text-3xl font-semibold mb-4 tracking-tight">{project.title}</h3>
                        <p className="text-neutral-400 leading-relaxed text-lg">{project.description}</p>
                      </div>
                      <div className="flex gap-3">
                        <a 
                          href={project.github}
                          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white flex items-center justify-center transition-all group/btn border border-white/10"
                        >
                          <Github size={18} className="text-white group-hover/btn:text-black transition-colors" />
                        </a>
                        <a 
                          href={project.demo}
                          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white flex items-center justify-center transition-all group/btn border border-white/10"
                        >
                          <ExternalLink size={18} className="text-white group-hover/btn:text-black transition-colors" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map(tech => (
                        <span 
                          key={tech} 
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-400 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articles Page */}
        {currentPage === 'articles' && !selectedArticle && (
          <div className="animate-fadeIn space-y-16">
            <div>
              <p className="text-sm uppercase tracking-widest text-neutral-500 font-medium mb-4">Writing</p>
              <h2 className="text-6xl font-semibold tracking-tight">Articles</h2>
            </div>
            
            <div className="space-y-6">
              {articles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="group w-full text-left bg-white/[0.02] border border-white/10 rounded-3xl p-10 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500"
                >
                  <div className="flex justify-between items-start gap-8">
                    <div className="flex-1 space-y-4">
                      <h3 className="text-3xl font-semibold tracking-tight group-hover:text-neutral-300 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-neutral-400 leading-relaxed text-lg">{article.excerpt}</p>
                      <div className="flex gap-6 text-sm text-neutral-500">
                        <span>{article.date}</span>
                        <span>·</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <ArrowUpRight 
                      size={24} 
                      className="text-neutral-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" 
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Article Detail View */}
        {currentPage === 'articles' && selectedArticle && (
          <ArticleDetail 
            article={selectedArticle} 
            onBack={() => setSelectedArticle(null)}
          />
        )}

        {/* Experience Page */}
        {currentPage === 'experience' && (
          <div className="animate-fadeIn space-y-16">
            <div>
              <p className="text-sm uppercase tracking-widest text-neutral-500 font-medium mb-4">Career</p>
              <h2 className="text-6xl font-semibold tracking-tight">Experience</h2>
            </div>
            
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/[0.02] border border-white/10 rounded-3xl p-10 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500"
                >
                  <h3 className="text-3xl font-semibold mb-2 tracking-tight">{exp.role}</h3>
                  <div className="text-neutral-500 mb-6 text-lg">{exp.company} · {exp.period}</div>
                  <p className="text-neutral-400 leading-relaxed text-lg">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-8 text-center text-neutral-600 text-sm">
          © 2026 Moeed Rehman
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default Portfolio;