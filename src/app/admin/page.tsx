import React from 'react'
import AdminNavigation from './component/adminNavbar'

const AdminPage = () => {
  return (
    <div className='w-screen h-screen bg-white flex justify-around items-center p-6'>
        <AdminNavigation/>
        <div className=' w-9/12 h-full p-6 shadow-2xl rounded-2xl border-2 text-black'>
            b
        </div>
    </div>
  )
}

export default AdminPage