import { useEffect } from "react";
import SuspenseWrapper from "./section/content"
import { getUserId } from "../utilities/token";

const ProductPage = () => {

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'View Product Page', {
        user_id : getUserId()
      });
    }
  }, [])

  return (
    <SuspenseWrapper />
  );
};

export default ProductPage;