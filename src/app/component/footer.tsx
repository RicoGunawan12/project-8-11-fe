import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="w-screen h-auto bg-black flex text-white py-6">
      {/* left part */}
      <div className="flex w-4/5 justify-around">
        <div className="flex flex-col">
          <Link href={"#"} className="font-semibold text-3xl">
            Title A
          </Link>
          <Link href={"#"}>Content A</Link>
          <Link href={"#"}>Content A</Link>
          <Link href={"#"}>Content A</Link>
          <Link href={"#"}>Content A</Link>
        </div>
        <div className="flex flex-col">
          <Link href={"#"} className="font-semibold text-3xl">
            Title B
          </Link>
          <Link href={"#"}>Content B</Link>
          <Link href={"#"}>Content B</Link>
          <Link href={"#"}>Content B</Link>
          <Link href={"#"}>Content B</Link>
        </div>
        <div className="flex flex-col">
          <Link href={"#"} className="font-semibold text-3xl">
            Title C
          </Link>
          <Link href={"#"}>Content C</Link>
          <Link href={"#"}>Content C</Link>
          <Link href={"#"}>Content C</Link>
          <Link href={"#"}>Content C</Link>
        </div>
        <div className="flex flex-col">
          <Link href={"#"} className="font-semibold text-3xl">
            Title D
          </Link>
          <Link href={"#"}>Content D</Link>
          <Link href={"#"}>Content D</Link>
          <Link href={"#"}>Content D</Link>
          <Link href={"#"}>Content D</Link>
        </div>
      </div>
      {/* right part */}
      <div className='flex'>
        <Link href={"#"}>A</Link>
        <Link href={"#"}>B</Link>
        <Link href={"#"}>C</Link>
        <Link href={"#"}>D</Link>
      </div>
    </div>
  );
}

export default Footer