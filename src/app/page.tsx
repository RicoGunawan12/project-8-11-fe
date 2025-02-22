import { Metadata } from "next";
import HomePageContent from "./home/section/content";
import { usePathname } from "next/navigation";

// export async function generateMetadata() {
//   return {
//     title: 'Tyeso Indonesia',
//     description: 'Discover our newest collection—where style meets functionality in every piece. Fresh designs, vibrant colors, and premium quality await to elevate your everyday essentials!',
//     keywords: ['Tyeso', 'Product', 'Bottle']
//   }
// }




export default function Home() {
  return (
    <main className="min-h-screen min-w-scren">
      <div className="w-screen h-fit p-0 m-0 bg-white">
        <HomePageContent />
      </div>
    </main>
  );
}
