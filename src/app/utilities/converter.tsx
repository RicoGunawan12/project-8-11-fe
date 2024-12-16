export const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const mapPaymentMethod = (paymentMethod: string): string => {
    switch (paymentMethod) {
      case "checkout-qris":
        return "QRIS";
      case "checkout-va":
        return "Virtual Account";
      case "checkout-credot":
        return "Credit Card";
      default:
        return paymentMethod; // In case an unknown payment method is found
    }
  };