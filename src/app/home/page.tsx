import React, { useEffect } from 'react';
import HomePageContent from './section/content';
import { getUserId } from '../utilities/token';

// export async function generateMetadata() {
//   return {
//     title: 'Tyeso Indonesia',
//     description: 'Discover our newest collection—where style meets functionality in every piece. Fresh designs, vibrant colors, and premium quality await to elevate your everyday essentials!',
//     keywords: ['Tyeso', 'Product', 'Bottle']
//   }
// }

const HomePage = () => {

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'View Home Page', {
        user_id : getUserId()
      });
    }
  }, [])

  return (
    <div className="w-screen h-fit p-0 m-0 bg-white">
      <HomePageContent />
    </div>
  );
}

export default HomePage;