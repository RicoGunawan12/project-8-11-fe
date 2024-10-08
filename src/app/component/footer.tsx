import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='w-screen flex'>
        {/* left part */}
        <div className='flex'>
            <div className="flex-col">
                <Link href={"#"} className='font-semibold'>Title A</Link>
                <Link href={"#"}>Content A</Link>
                <Link href={"#"}>Content A</Link>
                <Link href={"#"}>Content A</Link>
                <Link href={"#"}>Content A</Link>
            </div>
            <div className="flex-col">
                <Link href={"#"} className='font-semibold'>Title B</Link>
                <Link href={"#"}>Content B</Link>
                <Link href={"#"}>Content B</Link>
                <Link href={"#"}>Content B</Link>
                <Link href={"#"}>Content B</Link>
            </div>
            <div className="flex-col">
                <Link href={"#"} className='font-semibold'>Title C</Link>
                <Link href={"#"}>Content C</Link>
                <Link href={"#"}>Content C</Link>
                <Link href={"#"}>Content C</Link>
                <Link href={"#"}>Content C</Link>
            </div>
            <div className="flex-col">
                <Link href={"#"} className='font-semibold'>Title D</Link>
                <Link href={"#"}>Content D</Link>
                <Link href={"#"}>Content D</Link>
                <Link href={"#"}>Content D</Link>
                <Link href={"#"}>Content D</Link>
            </div>
        </div>
        {/* right part */}
        <div>

        </div>
    </div>
  )
}

export default Footer