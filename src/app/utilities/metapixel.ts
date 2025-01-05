// utilities/metaPixel.ts

declare global {
    interface Window {
      fbq: any;
    }
  }
  
  // Initialize pixel
  export const initializePixel = (pixelId: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('init', pixelId);
    }
  };
  
  // Track page view
  export const pageView = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  };
  
  // Track custom event
  export const event = (name: string, options = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', name, options);
    }
  };
  
  // Example events for your e-commerce site
  export const trackAddToCart = (data: { currency: string; value: number; content_ids: string[]; content_name: string }) => {
    event('AddToCart', data);
  };
  
  export const trackPurchase = (data: { currency: string; value: number; content_ids: string[] }) => {
    event('Purchase', data);
  };