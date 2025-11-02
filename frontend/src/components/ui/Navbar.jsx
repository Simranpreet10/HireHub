// import React, { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import Button from './Button'

// function Navbar() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userType, setUserType] = useState(null);
//   const [userName, setUserName] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     checkAuthStatus();
    
//     // Listen for auth changes
//     const handleAuthChange = () => {
//       checkAuthStatus();
//     };
    
//     window.addEventListener('authChange', handleAuthChange);
    
//     return () => {
//       window.removeEventListener('authChange', handleAuthChange);
//     };
//   }, []);

//   const checkAuthStatus = () => {
//     // Check for user token
//     const userToken = localStorage.getItem("token");
//     const userData = localStorage.getItem("userData");
    
//     // Check for admin token
//     const adminToken = localStorage.getItem("adminToken");
    
//     // Check for recruiter token (if you have one)
//     const recruiterToken = localStorage.getItem("recruiterToken");

//     if (userToken && userData) {
//       setIsAuthenticated(true);
//       setUserType("user");
//       try {
//         const user = JSON.parse(userData);
//         setUserName(user.full_name || user.email);
//       } catch (e) {
//         console.log(e);
//         setUserName("User");
//       }
//     } else if (adminToken) {
//       setIsAuthenticated(true);
//       setUserType("admin");
//       const adminData = localStorage.getItem("adminData");
//       if (adminData) {
//         try {
//           const admin = JSON.parse(adminData);
//           setUserName(admin.full_name || admin.email || "Admin");
//         } catch (e) {
//           console.log(e);
//           setUserName("Admin");
//         }
//       } else {
//         setUserName("Admin");
//       }
//     } else if (recruiterToken) {
//       setIsAuthenticated(true);
//       setUserType("recruiter");
//       const recruiterData = localStorage.getItem("recruiterData");
//       if (recruiterData) {
//         try {
//           const recruiter = JSON.parse(recruiterData);
//           setUserName(recruiter.full_name || recruiter.email || "Recruiter");
//         } catch (e) {
//           console.log(e);
//           setUserName("Recruiter");
//         }
//       } else {
//         setUserName("Recruiter");
//       }
//     } else {
//       setIsAuthenticated(false);
//       setUserType(null);
//       setUserName("");
//     }
//   };

//   const handleLogout = () => {
//     // Clear all tokens and user data
//     localStorage.removeItem("token");
//     localStorage.removeItem("userData");
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("adminData");
//     localStorage.removeItem("recruiterToken");
//     localStorage.removeItem("recruiterData");
    
//     setIsAuthenticated(false);
//     setUserType(null);
//     setUserName("");
    
//     // Redirect based on user type
//     if (userType === "admin") {
//       navigate("/admin/login");
//     } else {
//       navigate("/login");
//     }
//   };

//   const getDashboardLink = () => {
//     if (userType === "admin") return "/admin/dashboard";
//     if (userType === "recruiter") return "/recruiter/dashboard";
//     return "/user-dashboard";
//   };

//   return (
//     <header className="w-full bg-blue-600 shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center gap-4">
//             <Link to='/' className="text-white font-bold text-3xl hover:text-gray-200 transition">HireHub</Link>
//             <nav className="hidden md:flex gap-4 text-gray-200">
//               {/* <Link to='/jobs' className="px-3 py-2 rounded-md hover:bg-blue-500 transition">Jobs</Link>
//               <Link to='/companies' className="px-3 py-2 rounded-md hover:bg-blue-500 transition">Companies</Link> */}
//               {isAuthenticated && userType === "user" && (
//                 <>
//                   <Link to='/applications' className="px-3 py-2 rounded-md hover:bg-blue-500 transition">My Applications</Link>
//                   <Link to='/user-dashboard' className="px-3 py-2 rounded-md hover:bg-blue-500 transition">Dashboard</Link>
//                 </>
//               )}
//             </nav>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="hidden sm:flex items-center gap-3">
//               {isAuthenticated ? (
//                 <>
//                   <Link 
//                     to={getDashboardLink()} 
//                     className="text-sm text-gray-200 hover:text-white transition flex items-center"
//                   >
//                     <span className="mr-2">👤</span>
//                     {userName}
//                   </Link>
//                   <button 
//                     onClick={handleLogout}
//                     className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link to='/login' className="text-xl text-gray-200 hover:text-white transition">Log in</Link>
//                   <Link to='/signup' className="text-xl ml-2"><Button variant="primary">Sign up</Button></Link>
//                 </>
//               )}
//             </div>
//             {/* <div className="md:hidden">
//               <button className="p-2 rounded-md text-gray-200 hover:bg-blue-500 transition">☰</button>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Navbar;



























// src/components/ui/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";

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

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const checkAuthStatus = () => {
    const userToken = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    const adminToken = localStorage.getItem("adminToken");
    const recruiterToken = localStorage.getItem("recruiterToken");

    if (userToken && userData) {
      setIsAuthenticated(true);
      setUserType("user");
      try {
        const user = JSON.parse(userData);
        setUserName(user.full_name || user.email || "User");
      } catch (e) {
        console.warn(e);
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
          console.warn(e);
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
          // some payloads use full_name, name, or email
          setUserName(recruiter.full_name || recruiter.name || recruiter.email || "Recruiter");
        } catch (e) {
          console.warn(e);
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
    } else if (userType === "recruiter") {
      navigate("/recruiter/login");
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
            <Link to="/" className="text-white font-bold text-3xl hover:text-gray-200 transition">
              HireHub
            </Link>

            {/* Main nav for desktop */}
            <nav className="hidden md:flex gap-4 text-gray-200 items-center">
              {/* Common public links */}
              {/* <Link to="/jobs" className="px-3 py-2 rounded-md hover:bg-blue-500 transition">
                Jobs
              </Link>
              <Link to="/companies" className="px-3 py-2 rounded-md hover:bg-blue-500 transition">
                Companies
              </Link> */}

              {/* Role-specific links */}
              {isAuthenticated && userType === "user" && (
                <>
                  <Link to="/jobs" className="px-3 py-2 rounded-md hover:bg-blue-500 transition">
                Jobs
              </Link>
             
                  <Link to="/applications" className="px-3 py-2 rounded-md hover:bg-blue-500 transition">
                    My Applications
                  </Link>
                  <Link to="/user-dashboard" className="px-3 py-2 rounded-md hover:bg-blue-500 transition">
                    Dashboard
                  </Link>
                </>
              )}

              {isAuthenticated && userType === "recruiter" && (
                <>
                  <Link to="/recruiter/dashboard" className="px-3 py-2 rounded-md hover:bg-blue-500 transition">
                    Dashboard
                  </Link>
                  <Link to="/recruiter/jobs" className="px-3 py-2 rounded-md hover:bg-blue-500 transition">
                    Jobs
                  </Link>
                  <Link to="/recruiter/jobs/new" className="px-3 py-2 rounded-md hover:bg-blue-500 transition">
                    Post Job
                  </Link>
                  <Link to="/recruiter/applicants" className="px-3 py-2 rounded-md hover:bg-blue-500 transition">
                    Applicants
                  </Link>
                  <Link to="/recruiter/company" className="px-3 py-2 rounded-md hover:bg-blue-500 transition">
                    Company
                  </Link>
                </>
              )}

              {isAuthenticated && userType === "admin" && (
                <>
                  <Link to="/admin/dashboard" className="px-3 py-2 rounded-md hover:bg-blue-500 transition">
                    Admin
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              {isAuthenticated && (
                <>
                  <Link to={getDashboardLink()} className="text-sm text-gray-200 hover:text-white transition flex items-center">
                    <span className="mr-2">👤</span>
                    {userName}
                  </Link>

                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition">
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile / compact view actions */}
            {isAuthenticated && (
              <div className="md:hidden">
                {/* small dropdown for mobile (keeps it simple) */}
                <MobileMenu
                  isAuthenticated={isAuthenticated}
                  userType={userType}
                  userName={userName}
                  onLogout={handleLogout}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ isAuthenticated, userType, userName, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <details className="relative">
        <summary className="list-none cursor-pointer p-2 text-white">☰</summary>
        <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg text-gray-800 z-50">
          <div className="p-3 border-b">
            <div className="font-medium">{isAuthenticated ? userName : "Welcome"}</div>
          </div>

          <div className="flex flex-col">
            <Link className="px-4 py-2 hover:bg-gray-100" to="/jobs">Jobs</Link>
            <Link className="px-4 py-2 hover:bg-gray-100" to="/companies">Companies</Link>

            {isAuthenticated && userType === "user" && (
              <>
                <Link className="px-4 py-2 hover:bg-gray-100" to="/applications">My Applications</Link>
                <Link className="px-4 py-2 hover:bg-gray-100" to="/user-dashboard">Dashboard</Link>
              </>
            )}

            {isAuthenticated && userType === "recruiter" && (
              <>
                <Link className="px-4 py-2 hover:bg-gray-100" to="/recruiter/dashboard">Dashboard</Link>
                <Link className="px-4 py-2 hover:bg-gray-100" to="/recruiter/jobs">Jobs</Link>
                <Link className="px-4 py-2 hover:bg-gray-100" to="/recruiter/jobs/new">Post Job</Link>
                <Link className="px-4 py-2 hover:bg-gray-100" to="/recruiter/applicants">Applicants</Link>
                <Link className="px-4 py-2 hover:bg-gray-100" to="/recruiter/company">Company</Link>
                <Link className="px-4 py-2 hover:bg-gray-100" to="/recruiter/profile">Profile</Link>
              </>
            )}

            {isAuthenticated && userType === "admin" && (
              <Link className="px-4 py-2 hover:bg-gray-100" to="/admin/dashboard">Admin</Link>
            )}

            {!isAuthenticated && (
              <>
                <Link className="px-4 py-2 hover:bg-gray-100" to="/login">Log in</Link>
                <Link className="px-4 py-2 hover:bg-gray-100" to="/signup">Sign up</Link>
              </>
            )}

            {isAuthenticated && (
              <button className="text-left px-4 py-2 hover:bg-gray-100" onClick={() => { onLogout(); }}>
                Logout
              </button>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}

export default Navbar;
