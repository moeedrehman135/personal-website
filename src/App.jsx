import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, BookOpen, Code, Briefcase, User, Menu, X } from 'lucide-react';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      title: "Distributed Task Scheduler",
      description: "Built a fault-tolerant distributed system for task scheduling using Go and Redis",
      tech: ["Go", "Redis", "Docker", "gRPC"],
      github: "https://github.com/yourusername/task-scheduler",
      demo: "https://demo.example.com"
    },
    {
      title: "Real-time Chat Application",
      description: "WebSocket-based chat app with end-to-end encryption and message persistence",
      tech: ["React", "Node.js", "Socket.io", "MongoDB"],
      github: "https://github.com/yourusername/chat-app",
      demo: "https://demo.example.com"
    },
    {
      title: "ML Image Classifier",
      description: "CNN-based image classification model achieving 94% accuracy on custom dataset",
      tech: ["Python", "TensorFlow", "Flask", "Docker"],
      github: "https://github.com/yourusername/ml-classifier",
      demo: "https://demo.example.com"
    }
  ];

  const articles = [
    {
      title: "Understanding Consensus Algorithms in Distributed Systems",
      date: "Jan 2026",
      readTime: "8 min read",
      link: "https://medium.com/@yourusername/consensus-algorithms"
    },
    {
      title: "Optimizing React Performance: A Deep Dive",
      date: "Dec 2025",
      readTime: "6 min read",
      link: "https://medium.com/@yourusername/react-performance"
    },
    {
      title: "Building Scalable APIs with GraphQL",
      date: "Nov 2025",
      readTime: "10 min read",
      link: "https://medium.com/@yourusername/graphql-apis"
    }
  ];

  const experience = [
    {
      role: "Software Engineering Intern",
      company: "Tech Company",
      period: "Summer 2025",
      description: "Developed microservices for payment processing, reducing transaction latency by 40%"
    },
    {
      role: "Research Assistant",
      company: "University CS Lab",
      period: "2024 - Present",
      description: "Researching optimization algorithms for large-scale graph neural networks"
    }
  ];

  const skills = {
    "Languages": ["Python", "JavaScript", "Java", "Go", "C++"],
    "Frameworks": ["React", "Node.js", "Django", "Spring Boot"],
    "Tools": ["Git", "Docker", "Kubernetes", "AWS", "PostgreSQL"]
  };

  const NavButton = ({ section, icon: Icon, label }) => (
    <button
      onClick={() => {
        setActiveSection(section);
        setIsMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        activeSection === section
          ? 'bg-gray-900 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">YourName</div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-2">
            <NavButton section="about" icon={User} label="About" />
            <NavButton section="projects" icon={Code} label="Projects" />
            <NavButton section="articles" icon={BookOpen} label="Articles" />
            <NavButton section="experience" icon={Briefcase} label="Experience" />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-2">
            <NavButton section="about" icon={User} label="About" />
            <NavButton section="projects" icon={Code} label="Projects" />
            <NavButton section="articles" icon={BookOpen} label="Articles" />
            <NavButton section="experience" icon={Briefcase} label="Experience" />
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* About Section */}
        {activeSection === 'about' && (
          <div className="animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Hi, I'm Your Name
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
              Computer Science student passionate about building scalable systems and exploring 
              the intersection of distributed computing and machine learning.
            </p>
            
            <div className="flex gap-4 mb-12">
              <a href="https://github.com/yourusername" className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com/in/yourusername" className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="mailto:your.email@example.com" className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                <Mail size={24} />
              </a>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map(skill => (
                      <span key={skill} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="animate-fadeIn">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Projects</h2>
            <div className="grid gap-6">
              {projects.map((project, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a href={project.github} className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors">
                      <Github size={18} />
                      <span>Code</span>
                    </a>
                    <a href={project.demo} className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors">
                      <ExternalLink size={18} />
                      <span>Demo</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articles Section */}
        {activeSection === 'articles' && (
          <div className="animate-fadeIn">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Articles</h2>
            <div className="grid gap-6">
              {articles.map((article, idx) => (
                <a 
                  key={idx} 
                  href={article.link}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all hover:border-gray-300 block"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{article.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {activeSection === 'experience' && (
          <div className="animate-fadeIn">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Experience</h2>
            <div className="grid gap-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{exp.role}</h3>
                  <div className="text-gray-600 mb-3">{exp.company} • {exp.period}</div>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          © 2026 Your Name. Built with React and Tailwind CSS.
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;