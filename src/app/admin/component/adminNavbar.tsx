import Link from 'next/link'
import React from 'react'

const AdminNavigation = () => {
  return (
    <div className=' w-2/12 h-full p-6 shadow-2xl rounded-2xl border-2 text-black flex flex-col items-start'>
        <Link href="#">Categories</Link>
        <Link href="#">Product</Link>
        <Link href="#"></Link>
        <Link href="#"></Link>
        <Link href="#"></Link>
        <Link href="#"></Link>
    </div>
  )
}

export default AdminNavigation
