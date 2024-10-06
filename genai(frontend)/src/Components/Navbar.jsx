import React, { useContext, useEffect, useState } from 'react';
import logo from "../Assets/logo.jpg"
import { Link, useNavigate } from 'react-router-dom';
import CreateAxiosInstance from '../axios/axios'
import { NavLink } from 'react-router-dom';
import {MyContext} from '../Context/MyContext'

const Navbar = ({ theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const axiosInstance = CreateAxiosInstance();
  const navigate = useNavigate()
  const { login } = useContext(MyContext)
  const [name, setname] = useState()

  const NewChat = async () => {
    try {
      const res = await axiosInstance.post('chat/start-session/', {})
      navigate(`/chat/${res.data.session_id}`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    async function getData() {
        try {
            const res = await axiosInstance.get("user/profile/")
            setname(res.data.first_name)
        } catch (error) {
          console.log(error)
        }
    }
    getData()
}, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="backdrop-blur-lg rounded-full my-2 mx-12 p-4 bg-white bg-opacity-50">
      <div className="container mx-auto flex justify-between px-20 items-center backdrop-filter backdrop-blur-lg bg-white bg-opacity-50 p-4 rounded-full shadow-lg">
        {/* Logo */}
        <Link to=""><img src={logo} alt="" className='h-12' /></Link>

        {/* Links */}
        <div className="hidden md:flex space-x-6 text-xl text-black">
          <Link onClick={NewChat} className="hover:text-blue-400">Chat</Link>
          <NavLink to="/appointment" className={({ isActive }) => isActive ? "text-blue-400 underline underline-offset-2" : "text-black"}>Relif</NavLink>
        </div>

        {/* Theme Toggle Button */}
        {
          login ? (
            <Link to="/profile" className='size-10'><img src={`https://api.dicebear.com/9.x/initials/svg?seed=${name}`} alt="" className='rounded-full'/></Link>
          ) : (
            <Link to="/login" onClick={toggleTheme} className="hidden md:block px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600" >Login</Link>
          )
        }


        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-black focus:outline-none"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 space-y-4 text-black">
          <Link onClick={NewChat} className="hover:text-blue-400">Chat</Link>
          <NavLink to="/appointment" className={({ isActive }) => isActive ? "text-blue-400 underline underline-offset-2" : "text-black"}>Relif</NavLink>
          {/* Theme Toggle for mobile */}
          <button
            onClick={toggleTheme}
            className="w-full px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
          >
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
