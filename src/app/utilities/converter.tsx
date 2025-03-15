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
      case "checkout-credit":
        return "Credit Card";
      default:
        return paymentMethod; // In case an unknown payment method is found
    }
  };

const defaultLocales = "id-ID";
const defaultCurrency = "IDR";

const defaultNumberFormat = new Intl.NumberFormat(defaultLocales, {
  style: "currency",
  currency: defaultCurrency
});

export const formatCurrency = (value: number, locales: string = "id-ID", currency: string = "IDR") => {
  if (locales === defaultLocales && currency === defaultCurrency) {
    return defaultNumberFormat.format(value);
  }

  const numberFormat = new Intl.NumberFormat(locales, {
    style: "currency",
    currency
  });

  return numberFormat.format(value);
}