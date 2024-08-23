import React from 'react'
import Menu from './Menu'
import Search from './Search'
import { Link } from 'react-router-dom'
const Header = () => {
  return (
      <div className='header bg-light p-2'>
            <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between align-middle">
                  <Link className="logo" to="/"><h1 className='navbar-brand'>Khoa</h1></Link>
                  <Search />
                  <Menu />
            </nav>
      </div>
      
  )
}

export default Header