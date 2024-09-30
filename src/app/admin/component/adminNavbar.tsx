import Link from 'next/link'
import React from 'react'

const AdminNavigation = () => {
  return (
    <div className=' w-2/12 h-full p-6 shadow-2xl rounded-2xl border-2 text-black flex flex-col items-start'>
        <Link href="/admin/categories">Categories</Link>
        <Link href="/admin/product">Product</Link>
        <Link href="#">C</Link>
        <Link href="#">D</Link>
        <Link href="#">E</Link>
        <Link href="#">F</Link>
    </div>
  )
}

export default AdminNavigation
