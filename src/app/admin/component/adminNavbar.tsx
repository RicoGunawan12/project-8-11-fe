import Link from 'next/link'
import React from 'react'

const AdminNavigation = () => {
  return (
    <div className=' w-2/12 h-full p-6 shadow-2xl rounded-2xl border-2 text-black flex flex-col items-start'>
        <Link href="/admin/categories">Categories</Link>
        <Link href="/admin/product">Product</Link>
        <Link href="/admin/voucher">Voucher</Link>
        <Link href="/admin/promo">Promo</Link>
        <Link href="/admin/post">Post</Link>
        <Link href="/admin/blog">blogs</Link>
        <Link href="/admin/faq">FAQ</Link>
    </div>
  )
}

export default AdminNavigation
