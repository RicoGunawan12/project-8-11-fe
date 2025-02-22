import React from 'react';
import HomePageContent from './section/content';

// export async function generateMetadata() {
//   return {
//     title: 'Tyeso Indonesia',
//     description: 'Discover our newest collection—where style meets functionality in every piece. Fresh designs, vibrant colors, and premium quality await to elevate your everyday essentials!',
//     keywords: ['Tyeso', 'Product', 'Bottle']
//   }
// }

const HomePage = () => {

  return (
    <div className="w-screen h-fit p-0 m-0 bg-white">
      <HomePageContent />
    </div>
  );
}

export default HomePage;