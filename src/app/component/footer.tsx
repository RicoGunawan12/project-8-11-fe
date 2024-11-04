import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="w-screen h-auto bg-black text-white py-6">
      <div className="flex w-full justify-around">
        <div className="flex flex-col justify-center items-center w-1/5">
          <h1 className='font-bold text-5xl'>TYESO</h1>
          <div className='text-white w-full flex justify-center text-xs mt-1'>
            © 2024 - TYESO
          </div>
        </div>
        <div className="flex flex-col w-1/5">
          <h1 className='font-semibold text-lg'>HERE IS ANYWHERE</h1>
          <span className='flex flex-wrap text-xs mt-4'>The TYESO brand is built on the principles of Quality, Life, and Health. We see quality as the foundation, life as the essence of our brand, and health as our pledge to you. Each product is crafted to perfectly balance these elements, ensuring an exceptional experience.</span>
        </div>
        <div className="flex flex-col w-1/5">
          <h1 className='font-semibold text-lg'>SUPPORT</h1>
          <Link href={"#"} className='text-xs mt-3'>About Us</Link>
          <Link href={"#"} className='text-xs mt-2'>Contact Us</Link>
          <Link href={"#"} className='text-xs mt-2'>Blogs</Link>
          <Link href={"#"} className='text-xs mt-2'>FAQs</Link>
          <Link href={"#"} className='text-xs mt-2'>Shipping</Link>
          <Link href={"#"} className='text-xs mt-2'>Privacy Policy</Link>
          <Link href={"#"} className='text-xs mt-2'>Partner with us</Link>
        </div>
        <div className="flex flex-col w-1/5">
          <h1 className='font-semibold text-lg'>Our Marketplace</h1>
          <Link href={"#"} className='text-xs mt-3'>Tokopedia</Link>
          <Link href={"#"} className='text-xs mt-2'>Shopee</Link>
          <Link href={"#"} className='text-xs mt-2'>Tiktok</Link>
          <Link href={"#"} className='text-xs mt-2'>Instagram</Link>
        </div>
      </div>
    </div>
  );
}

export default Footer