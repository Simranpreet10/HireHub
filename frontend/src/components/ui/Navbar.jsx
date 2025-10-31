import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from './Button'

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const checkAuthStatus = () => {
    // Check for user token
    const userToken = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    
    // Check for admin token
    const adminToken = localStorage.getItem("adminToken");
    
    // Check for recruiter token (if you have one)
    const recruiterToken = localStorage.getItem("recruiterToken");

    if (userToken && userData) {
      setIsAuthenticated(true);
      setUserType("user");
      try {
        const user = JSON.parse(userData);
        setUserName(user.full_name || user.email);
      } catch (e) {
        setUserName("User");
      }
    } else if (adminToken) {
      setIsAuthenticated(true);
      setUserType("admin");
      const adminData = localStorage.getItem("adminData");
      if (adminData) {
        try {
          const admin = JSON.parse(adminData);
          setUserName(admin.full_name || admin.email || "Admin");
        } catch (e) {
          setUserName("Admin");
        }
      } else {
        setUserName("Admin");
      }
    } else if (recruiterToken) {
      setIsAuthenticated(true);
      setUserType("recruiter");
      const recruiterData = localStorage.getItem("recruiterData");
      if (recruiterData) {
        try {
          const recruiter = JSON.parse(recruiterData);
          setUserName(recruiter.full_name || recruiter.email || "Recruiter");
        } catch (e) {
          setUserName("Recruiter");
        }
      } else {
        setUserName("Recruiter");
      }
    } else {
      setIsAuthenticated(false);
      setUserType(null);
      setUserName("");
    }
  };

  const handleLogout = () => {
    // Clear all tokens and user data
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("recruiterToken");
    localStorage.removeItem("recruiterData");
    
    setIsAuthenticated(false);
    setUserType(null);
    setUserName("");
    
    // Redirect based on user type
    if (userType === "admin") {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }
  };

  const getDashboardLink = () => {
    if (userType === "admin") return "/admin/dashboard";
    if (userType === "recruiter") return "/recruiter/dashboard";
    return "/user-dashboard";
  };

  return (
    <header className="w-full bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link to='/' className="text-white font-bold text-2xl hover:text-gray-200 transition">HireHub</Link>
            <nav className="hidden md:flex gap-4 text-gray-200">
              <Link to='/jobs' className="px-3 py-2 rounded-md hover:bg-blue-500 transition">Jobs</Link>
              <Link to='/companies' className="px-3 py-2 rounded-md hover:bg-blue-500 transition">Companies</Link>
              {isAuthenticated && userType === "user" && (
                <>
                  <Link to='/applications' className="px-3 py-2 rounded-md hover:bg-blue-500 transition">My Applications</Link>
                  <Link to='/user-dashboard' className="px-3 py-2 rounded-md hover:bg-blue-500 transition">Dashboard</Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="text-sm text-gray-200 hover:text-white transition flex items-center"
                  >
                    <span className="mr-2">👤</span>
                    {userName}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to='/login' className="text-sm text-gray-200 hover:text-white transition">Log in</Link>
                  <Link to='/signup' className="ml-2"><Button variant="primary">Sign up</Button></Link>
                </>
              )}
            </div>
            <div className="md:hidden">
              <button className="p-2 rounded-md text-gray-200 hover:bg-blue-500 transition">☰</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar;