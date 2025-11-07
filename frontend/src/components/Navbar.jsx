import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              College Notice Board
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">
              Home
            </Link>
            {token ? (
              <>
                <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin-login" className="hover:bg-blue-700 px-3 py-2 rounded">
                Admin Login
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-blue-700 px-2 py-1 rounded"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block hover:bg-blue-700 px-3 py-2 rounded">
                Home
              </Link>
              {token ? (
                <>
                  <Link to="/dashboard" className="block hover:bg-blue-700 px-3 py-2 rounded">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left hover:bg-blue-700 px-3 py-2 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/admin-login" className="block hover:bg-blue-700 px-3 py-2 rounded">
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
