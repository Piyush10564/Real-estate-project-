// Format price in Indian Rupees with proper notation
export const formatPriceINR = (price) => {
  if (!price) return '₹0';
  
  const crore = 10000000;
  const lakh = 100000;

  if (price >= crore) {
    const crores = (price / crore).toFixed(1);
    const cleanCrores = crores.endsWith('.0') ? crores.slice(0, -2) : crores;
    return `₹${cleanCrores} Cr`;
  } else if (price >= lakh) {
    const lakhs = (price / lakh).toFixed(1);
    const cleanLakhs = lakhs.endsWith('.0') ? lakhs.slice(0, -2) : lakhs;
    return `₹${cleanLakhs} L`;
  } else {
    return `₹${price.toLocaleString('en-IN')}`;
  }
};

// Format detailed Indian numbering system (e.g., 1,23,45,000)
export const formatIndianNumber = (number) => {
  if (!number) return '0';
  return new Intl.NumberFormat('en-IN').format(number);
};
