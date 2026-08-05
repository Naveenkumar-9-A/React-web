import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';

export default function BlogDetail() {
  const { slug } = useParams(); 
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get('page') || 1;

  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchBlogData();
  }, [slug, currentPage]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/blogs/${slug}/?page=${currentPage}`);     
      const data = await res.json();
      
      setBlog(data.blog);
      setRecentBlogs(data.recent_blogs || []);
      setHasPrevious(data.has_previous || false);
      setHasNext(data.has_next || false);

      // 🎯 FIX: Automatically snaps the browser window frame back to the top 
      // header text grid layout instantly when a user changes articles!
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Failed to fetch blog details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!blog) return;
    const contentEl = document.getElementById('blogContent');
    const tocNav = document.getElementById('toc-nav');
    if (!contentEl || !tocNav) return;

    const headings = contentEl.querySelectorAll('h2');
    tocNav.innerHTML = ''; 

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
      const a = document.createElement('a');
      a.textContent = heading.textContent;
      a.href = `#${heading.id}`;
      a.className = 'sidebar-link';
      
      a.style.display = 'block';
      a.style.fontSize = '0.95rem';
      a.style.color = '#4a5568';
      a.style.textDecoration = 'none';
      a.style.padding = '0.25rem 0.5rem';
      a.style.borderLeft = '2px solid transparent';
      a.style.transition = 'all 0.2s ease';
      
      a.onmouseenter = () => {
        a.style.color = '#ff4f00';
        a.style.borderLeftColor = '#ff4f00';
        a.style.paddingLeft = '0.75rem';
        a.style.backgroundColor = '#fffaf0';
      };
      a.onmouseleave = () => {
        a.style.color = '#4a5568';
        a.style.borderLeftColor = 'transparent';
        a.style.paddingLeft = '0.5rem';
        a.style.backgroundColor = 'transparent';
      };

      tocNav.appendChild(a);
    });
  }, [blog]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return <div className="text-center py-5" style={{ fontSize: '1.2rem', color: '#718096', fontFamily: 'system-ui' }}>Loading blog post...</div>;
  }

  if (!blog) {
    return <div className="text-center py-5" style={{ fontSize: '1.2rem', color: '#718096', fontFamily: 'system-ui' }}>Blog post not found.</div>;
  }

  const featuredImage = blog.image_url 
    ? blog.image_url.startsWith('http') ? blog.image_url : `${BACKEND_URL}${blog.image_url}`
    : '/images/R-logo.webp';

  return (
    <>
      <style>{`
  .blog-container {
    max-width: 1140px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
    /* font-family: 'Inter', system-ui, sans-serif; */
    color: #2d3748;
  }
  .blog-header { text-align: center; margin-bottom: 1.5rem; }
  .blog-title {
    font-size: 2.4rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
    background: linear-gradient(180deg, #fde68a, #fbbf24);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .blog-meta {
    display: flex; align-items: center; justify-content: center;
    flex-wrap: wrap; gap: 0.75rem; font-size: 0.95rem; color: #718096;
  }
  .blog-meta-author { font-weight: 600; color: #68654a; }
  .blog-meta-separator { width: 4px; height: 4px; background-color: #facc15; border-radius: 50%; }
  
  .blog-featured-image-wrapper {
    width: 100%; border-radius: 1rem; overflow: hidden;
    border: 1px solid rgba(251,191,36,.2);
    box-shadow: 0 10px 30px rgba(250,204,21,.08); margin-bottom: 2rem; aspect-ratio: 16 / 9;
  }
  .blog-featured-image { width: 100%; height: 100%; object-fit: cover; }
  
  .blog-content-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
  @media (min-width: 992px) {
    .blog-content-grid { grid-template-columns: minmax(0, 2.2fr) 1fr; }
    .sidebar-sticky { position: sticky; top: 100px; }
  }
  
  /* Article Styling */
  .blog-content {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #2d3748;
    background: #ffffff;
    border: 1px solid rgba(250,204,21,.2);
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,.06);
    padding: 2.25rem 2.5rem;
    position: relative;
    overflow: hidden;
    transition: .5s;
  }
  .blog-content::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(251,191,36,.06), transparent);
    transition: 0.8s;
    pointer-events: none;
  }
  .blog-content:hover {
    transform: translateY(-3px);
    border-color: #facc15;
    box-shadow: 0 20px 40px rgba(250,204,21,.15);
  }
  .blog-content:hover::after { left: 100%; }
  .blog-content p { margin-bottom: 1.25rem; }
  .blog-content h2 {
    font-size: 1.6rem;
    font-weight: 700;
    color: #1a202c;
    margin-top: 1.75rem;
    margin-bottom: 1rem;
    padding-left: 0.9rem;
    border-left: 4px solid #facc15;
    scroll-margin-top: 100px;
  }
  .blog-content h2:first-child { margin-top: 0; }
  .blog-content strong { color: #a16207; }
  .blog-content a {
    color: #a16207;
    text-decoration: underline;
    text-decoration-color: rgba(250,204,21,.5);
    text-underline-offset: 2px;
  }
  .blog-content a:hover { color: #92400e; text-decoration-color: #facc15; }
  .blog-content blockquote {
    border-left: 4px solid #facc15;
    padding: 1rem 1.5rem;
    font-style: italic;
    background: rgba(250,204,21,.06);
    margin: 1.5rem 0;
    border-radius: 0 0.5rem 0.5rem 0;
    position: relative;
    z-index: 1;
  }
  .blog-content ul, .blog-content ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
  .blog-content li { margin-bottom: 0.5rem; }
  .blog-content img { border-radius: 0.75rem; border: 1px solid rgba(250,204,21,.15); margin: 1.5rem 0; }
  
  /* Cards */
  .sidebar-card { background: #ffffff; border: 1px solid rgba(250,204,21,.2); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1.5rem; transition: .3s; }
  .sidebar-card:hover { border-color: #facc15; box-shadow: 0 10px 25px rgba(250,204,21,.1); }
  .sidebar-title { font-size: 1rem; font-weight: 700; letter-spacing: 0.05em; color: #1a202c; margin-bottom: 1rem; border-bottom: 2px solid rgba(250,204,21,.2); padding-bottom: 0.5rem; }
  
  .share-buttons { display: flex; gap: 0.75rem; }
  .share-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(250,204,21,.3); background: rgba(250,204,21,.1); cursor: pointer; transition: all 0.2s; color: #a16207; font-weight: 700; text-decoration: none; }
  .share-btn:hover { background: #facc15; color: #1a202c; border-color: #facc15; transform: translateY(-2px); }
  
  /* Recent Cards Grid */
  .recent-posts-section { margin-top: 3rem; border-top: 1px solid rgba(250,204,21,.2); padding-top: 2rem; }
  .recent-posts-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
  @media (min-width: 576px) { .recent-posts-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 992px) { .recent-posts-grid { grid-template-columns: repeat(4, 1fr); } }
  
  .post-card { display: flex; flex-direction: column; background: #ffffff; border: 1px solid rgba(250,204,21,.2); border-radius: 0.75rem; overflow: hidden; text-decoration: none; color: inherit; height: 100%; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
  .post-card:hover { transform: translateY(-4px); border-color: #facc15; box-shadow: 0 10px 20px rgba(250,204,21,.15); }
  .post-image { width: 100%; aspect-ratio: 16 / 10; overflow: hidden; }
  .post-image img { width: 100%; height: 100%; object-fit: cover; }
  .post-content { padding: 1rem; display: flex; flex-direction: column; flex-grow: 1; }
  .post-title { font-size: 1rem; font-weight: 700; color: #1a202c; margin-bottom: 0.5rem; line-height: 1.4; }
  .post-date { font-size: 0.85rem; color: #a0aec0; margin-top: auto; }
`}</style>

      <Helmet>
        <title>{`${blog.title} - Aorbo Treks`}</title>
        <meta name="description" content={`${blog.title?.slice(0, 120)}...`} />
        <meta name="author" content={blog.author} />
      </Helmet>

      <main className="blog-container">
        <div className="blog-header">
          <h1 className="blog-title">{blog.title}</h1>
          <div className="blog-meta">
            <div className="blog-meta-author">By {blog.author}</div>
            <div className="blog-meta-separator"></div>
            <div className="blog-meta-item">
              {new Date(blog.created_at).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              })}
            </div>
            <div className="blog-meta-separator"></div>
            <div className="blog-meta-item">5 min read</div>
          </div>
        </div>

        <div className="blog-featured-image-wrapper">
          <img src={featuredImage} alt={blog.title} className="blog-featured-image" />
        </div>

        <div className="blog-content-grid">
          <article 
            className="blog-content" 
            id="blogContent"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
          />

          <aside className="blog-sidebar">
            <div className="sidebar-sticky">
              <div className="sidebar-card">
                <h3 className="sidebar-title">📚 Table of Contents</h3>
                <nav id="toc-nav"></nav>
              </div>

              <div className="sidebar-card">
                <h3 className="sidebar-title">Share this Article</h3>
                <div className="share-buttons">
                  <button className="share-btn" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>f</button>
                  <button className="share-btn" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, '_blank')}>𝕏</button>
                  <button className="share-btn" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}>in</button>
                  <button className="share-btn" onClick={handleCopyLink}>🔗</button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {recentBlogs.length > 0 && (
          <section className="recent-posts-section">
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1a202c' }}>Recent Posts</h2>
            <div className="recent-posts-grid">
              {recentBlogs.map((recent_blog) => {
                const recentImg = recent_blog.image_url 
                  ? recent_blog.image_url.startsWith('http') ? recent_blog.image_url : `${BACKEND_URL}${recent_blog.image_url}`
                  : '/images/R-logo.webp';

                return (
                  <Link to={`/blogs/${recent_blog.slug}`} key={recent_blog.slug} className="post-card">
                    <div className="post-image">
                      <img src={recentImg} alt={recent_blog.title} loading="lazy" />
                    </div>
                    <div className="post-content">
                      <h3 className="post-title">{recent_blog.title}</h3>
                      <div className="post-date">
                        {new Date(recent_blog.created_at).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric'
                        })}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pagination d-flex justify-content-center gap-2 mt-4">
              {hasPrevious && (
                <Link to={`/blog/${slug}?page=${parseInt(currentPage) - 1}`} className="btn btn-outline-dark">
                  ← Previous
                </Link>
              )}
              {hasNext && (
                <Link to={`/blogs/${slug}?page=${parseInt(currentPage) + 1}`} className="btn btn-outline-dark">
                  Next →
                </Link>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}