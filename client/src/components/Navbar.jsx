import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion } from 'motion/react';

const Navbar = () => {

    const { setShowLogin, user, logout, isOwner, axios, setIsOwner, theme, toggleTheme } = useAppContext()


    const location = useLocation();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()

    const changeRole = async () => {
        try {
            const { data } = await axios.post('/api/owner/change-role')
            if (data.success) {
                setIsOwner(true)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center justify-between px-6 md:px-16 
        lg:px-24 xl:px-32 py-4 text-gray-600 dark:text-gray-300 border-b
         border-borderColor dark:border-gray-700 relative transition-all ${location.pathname === "/" ? "bg-light" : "dark:bg-gray-900"}`}>
            <Link to="/">
                <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="Logo" className="h-8 dark:brightness-0 dark:invert" />
            </Link>
            <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 
            max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start 
            sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 
            ${location.pathname === "/" ? "bg-light" : "bg-white dark:bg-gray-900"}
            ${open ? " max-sm:translate-x-0" : " max-sm:translate-x-full"}`}>
                {menuLinks.map((link, index) => (
                    <Link key={index} to={link.path} >
                        {link.name}
                    </Link>
                ))}
                <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor dark:border-gray-700 px-3 rounded-full max-w-56'>
                    <input type="text" className="py-1.5 w-full bg-transparent
                outline-none placeholder-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Search products" />
                    <img src={assets.search_icon} alt="search" />
                </div>

                <div className='flex max-sm:flex-col items-start sm-items-center gap-6'>
                    <button onClick={toggleTheme} className="cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle Theme">
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        )}
                    </button>

                    <button onClick={() => isOwner ? navigate('/owner') : changeRole()} className="cursor-pointer">{isOwner ? 'Dashboard' : 'List cars'}</button>

                    <button onClick={() => { user ? logout() : setShowLogin(true) }} className="cursor-pointer px-8 py-2 bg bg-primary
                hover:bg-primary-dull transition-all text-white rounded-lg"> {user ? 'Logout' : 'Login'} </button>
                </div>
            </div>
            <button className='sm:hidden cursor-pointer' aria-Label="Menu" onClick={() => setOpen(!open)}>
                <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
            </button>

        </motion.div>
    )
}

export default Navbar
