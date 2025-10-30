import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-black border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-600 flex justify-between">
        <span>© {new Date().getFullYear()} JobFlow. All rights reserved.</span>
        <span>Built with ❤️ • Privacy • Terms</span>
      </div>
    </footer>
  )
}
