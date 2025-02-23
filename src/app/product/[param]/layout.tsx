import { Metadata } from "next";



const ProductDetailLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <section>
      {children}
    </section>
  );
};

export default ProductDetailLayout;