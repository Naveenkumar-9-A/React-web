import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/Blogs.css';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(page);
    fetchBlogs(page);
  }, [searchParams]);

  const fetchBlogs = async (page = 1) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/blogs/?page=${page}`);
      const data = await res.json();
      setBlogs(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Failed to fetch blogs', err);
      setBlogs([]);
      setTotalPages(1);
    }
  };

  const goToPage = (page) => {
    setSearchParams({ page });
  };

  return (
    <main className="blogs-container">
      <h1 className="blogs-heading">Blogs</h1>

      {blogs.length > 0 ? (
        <div className="blogs-scroll">
          {blogs.map((blog) => (
            <div className="blog-card" key={blog.slug}>
              <div className="blog-image">
                <Link to={`/blogs/${blog.slug}`}>
                  <img src={blog.image_url || '/images/placeholder-trek.jpg'} alt={blog.title} />
                </Link>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <img src="/images/R-logo.webp" alt="Aorbo" className="blog-logo" />
                  <div className="blog-date">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                </div>
                <h2 className="blog-title">
                  <Link to={`/blogs/${blog.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {blog.title}
                  </Link>
                </h2>
                <p className="blog-excerpt">
                  {blog.excerpt || blog.content?.replace(/<[^>]+>/g, '').split(' ').slice(0, 35).join(' ') + '...'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-blogs-message">
          <p>No blog posts available at the moment. Check back soon!</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <ul>
            {currentPage > 1 && (
              <li><a href="#" onClick={(e) => { e.preventDefault(); goToPage(currentPage - 1); }}>&laquo; Previous</a></li>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <li key={num} className={currentPage === num ? 'active' : ''}>
                {currentPage === num ? (
                  <span>{num}</span>
                ) : (
                  <a href="#" onClick={(e) => { e.preventDefault(); goToPage(num); }}>{num}</a>
                )}
              </li>
            ))}

            {currentPage < totalPages && (
              <li><a href="#" onClick={(e) => { e.preventDefault(); goToPage(currentPage + 1); }}>Next &raquo;</a></li>
            )}
          </ul>
        </div>
      )}
    </main>
  );
}
