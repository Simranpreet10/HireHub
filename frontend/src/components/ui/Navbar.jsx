import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

function Navbar() {
  return (
    <header className="w-full bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link to='/' className="text-white font-bold text-2xl hover:text-gray-200 transition">HireHub</Link>
            <nav className="hidden md:flex gap-4 text-gray-200">
              <Link to='/jobs' className="px-3 py-2 rounded-md hover:bg-blue-500 transition">Jobs</Link>
              <Link to='/companies' className="px-3 py-2 rounded-md hover:bg-blue-500 transition">Companies</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Link to='/login' className="text-sm text-gray-200 hover:text-white transition">Log in</Link>
              <Link to='/signup' className="ml-2"><Button variant="primary">Sign up</Button></Link>
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