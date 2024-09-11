import React from 'react'

const Navbar = () => {
  return (
    <div className='fixed top-0 z-50 lg:w-screen bg-secondary lg:flex lg:justify-between lg:py-2 lg:px-6 lg:rounded-b-xl lg:flex-wrap lg:items-center drop-shadow-default'>
        
        {/* Logo */}
        <div className='lg:text-3xl lg:font-bold text-white'>
            TYESO
        </div>
        
        {/* Navigation */}
        <div className='lg:text-lg text-white lg:font-semibold'>
            <a href="/product">Product</a>
        </div>

        {/* right party (cart & profile) */}
        <div className='lg:text-lg text-white lg:font-semibold'>
            profile
        </div>
    </div>
  )
}

export default Navbar