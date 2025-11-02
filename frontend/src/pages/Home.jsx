import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">Welcome to HireHub</h1>
          <p className="text-2xl text-gray-600 mb-2">Your Gateway to Career Success</p>
          <p className="text-lg text-gray-500">Find your dream job or hire top talent.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full mb-12">
          {/* Job Seeker Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:scale-105">
            <div className="text-center mb-6">
              <div className="text-7xl mb-4 animate-bounce">👤</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Job Seeker</h2>
              <p className="text-gray-600">Looking for your next opportunity?</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-md"
              >
                Login as Job Seeker
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-6 rounded-lg border-2 border-blue-600 transition transform hover:scale-105"
              >
                Sign Up as Job Seeker
              </button>
            </div>
          </div>

          {/* Recruiter Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:scale-105">
            <div className="text-center mb-6">
              <div className="text-7xl mb-4 animate-bounce">🏢</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Recruiter</h2>
              <p className="text-gray-600">Looking to hire talented professionals?</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/recruiter/login")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-md"
              >
                Login as Recruiter
              </button>
              <button
                onClick={() => navigate("/recruiter/signup")}
                className="w-full bg-white hover:bg-gray-50 text-green-600 font-semibold py-3 px-6 rounded-lg border-2 border-green-600 transition transform hover:scale-105"
              >
                Sign Up as Recruiter
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce mt-8">
          <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Why Choose HireHub?</h3>
            <p className="text-xl text-gray-600">Experience the best in job matching and recruitment</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🎯</div>
              <h4 className="text-2xl font-semibold text-gray-800 mb-3">Smart Matching</h4>
              <p className="text-gray-600">Advanced algorithms connect job seekers with perfect opportunities and help recruiters find ideal candidates.</p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">⚡</div>
              <h4 className="text-2xl font-semibold text-gray-800 mb-3">Fast Process</h4>
              <p className="text-gray-600">Streamlined application and hiring process saves time for both job seekers and recruiters.</p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🔒</div>
              <h4 className="text-2xl font-semibold text-gray-800 mb-3">Secure Platform</h4>
              <p className="text-gray-600">Your personal and company data is protected with industry-leading security measures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-green-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">HireHub by Numbers</h3>
            <p className="text-xl text-blue-100">Join thousands who trust us</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-xl text-blue-100">Active Jobs</div>
            </div>
            
            <div className="p-6">
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-xl text-blue-100">Job Seekers</div>
            </div>
            
            <div className="p-6">
              <div className="text-5xl font-bold mb-2">5K+</div>
              <div className="text-xl text-blue-100">Companies</div>
            </div>
            
            <div className="p-6">
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-xl text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h3>
            <p className="text-xl text-gray-600">Simple steps to get started</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h4 className="text-2xl font-bold text-blue-600 mb-6 flex items-center">
                <span className="mr-3">👤</span> For Job Seekers
              </h4>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">Create Your Profile</h5>
                    <p className="text-gray-600 text-sm">Sign up and build your professional profile with skills and experience</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">Search & Apply</h5>
                    <p className="text-gray-600 text-sm">Browse thousands of jobs and apply with one click</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">Get Hired</h5>
                    <p className="text-gray-600 text-sm">Track applications and connect with recruiters</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* For Recruiters */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h4 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                <span className="mr-3">🏢</span> For Recruiters
              </h4>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">Register Your Company</h5>
                    <p className="text-gray-600 text-sm">Create your company profile and showcase your culture</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">Post Jobs</h5>
                    <p className="text-gray-600 text-sm">Create detailed job listings and reach qualified candidates</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">Hire Top Talent</h5>
                    <p className="text-gray-600 text-sm">Review applications and hire the best candidates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-blue-100">Join HireHub today and take the next step in your career journey</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition transform hover:scale-105 shadow-lg text-lg"
            >
              Sign Up as Job Seeker
            </button>
            <button
              onClick={() => navigate("/recruiter/signup")}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-lg transition transform hover:scale-105 text-lg"
            >
              Register as Recruiter
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h4 className="text-white text-xl font-bold mb-4">HireHub</h4>
              <p className="text-sm text-gray-400">
                Connecting talent with opportunity. Your trusted partner in career growth and recruitment success.
              </p>
            </div>
            
            {/* For Job Seekers */}
            <div>
              <h5 className="text-white font-semibold mb-4">For Job Seekers</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="/signup" className="hover:text-white transition">Create Account</a></li>
                <li><a href="/login" className="hover:text-white transition">Sign In</a></li>
              </ul>
            </div>
            
            {/* For Recruiters */}
            <div>
              <h5 className="text-white font-semibold mb-4">For Recruiters</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="/recruiter/signup" className="hover:text-white transition">Register Company</a></li>
                <li><a href="/recruiter/login" className="hover:text-white transition">Recruiter Login</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h5 className="text-white font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
                <p className="text-sm text-gray-400">
                  © 2025 HireHub. All rights reserved.
                </p>
                <a 
                  href="/admin/login" 
                  className="text-xs text-gray-500 hover:text-gray-300 transition"
                >
                  Admin Login
                </a>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="text-2xl">📘</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="text-2xl">🐦</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="text-2xl">💼</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="text-2xl">📧</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
