import SuspenseWrapper from "./section/content"

export async function generateMetadata() {
  return {
    title: 'Products - Tyeso Indonesia',
    description: 'Discover our newest collection—where style meets functionality in every piece. Fresh designs, vibrant colors, and premium quality await to elevate your everyday essentials!',
    keywords: ['Tyeso', 'Product', 'Bottle']
  }
}

const ProductPage = () => {
  return (
    <SuspenseWrapper />
  );
};

export default ProductPage;