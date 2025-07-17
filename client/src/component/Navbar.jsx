import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="flex fixed left-0 backdrop-blur-md z-50 justify-between items-center bg-white/30 shadow-md px-6 py-4 w-full top-0">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition">
            Sweet Management
        </Link>
        <Link to={'/add-item'} className='underline hover:cursor-pointer'>
            Add Item
        </Link>

      
    </nav>
  )
}

export default Navbar