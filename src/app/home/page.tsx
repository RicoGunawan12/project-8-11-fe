import React from 'react'
import Navbar from '../component/navbar'

const HomePage = () => {

  const banners = [
    {
      title : "Ini ke-1",
      name : "TYESO Travel Mug 1",
      link : "https://tyesoindonesia.id/wp-content/uploads/2024/02/232-1024x1024.png",
      id: "1",
    },
    {
      title : "Ini ke-2",
      name : "TYESO Travel Mug 2",
      link : "https://tyesoindonesia.id/wp-content/uploads/2024/02/1.1-1.jpg",
      id: "",
    },
    {
      title : "Ini ke-3",
      name : "TYESO Travel Mug 3",
      link : "https://tyesoindonesia.id/wp-content/uploads/2024/02/1.2.jpg",
      id: "",
    },
    {
      title : "Ini ke-4",
      name : "TYESO Travel Mug 4",
      link : "https://tyesoindonesia.id/wp-content/uploads/2024/02/1.3.jpg",
      id: "",
    },
  ]

  const slideNext = () =>{
    const slider = document.getElementById('slider')

    if(slider){
      slider.style.transform = 'translate(-1024px, 0)'
    }

  }

  return (
    <div className='w-screen bg-white'>
        <Navbar/>
        <div className='h-screen w-screen flex overflow-x-auto'>
          {banners.map((banner, index) => (
            <div key={index} className="w-screen h-full bg-green-500 flex-none relative">
              <img src={banner.link} alt={banner.title} className="w-full h-full object-cover" />
              <div className="text-center mt-2 z-10 absolute top-64 left-0 w-full"> 
                <div className='font-semibold text-4xl flex items-start'>{banner.title}</div>
                <div className='font-bold text-7xl flex items-start'>{banner.name}</div>
                <a href={`/product/${banner.id}`} className='font-semibold text-4xl flex items-start mt-40 border-b-4 border-black'>
                  Discover Now
                  <span className='ml-2 text-4xl'>
                    &#8594;
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <button onClick={slideNext}>s</button>
    </div>
  )
}

export default HomePage