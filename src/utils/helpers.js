// formats an expiry date as MM/YY
export const formatExpiryDate = value => {
  if (!value) return '-';

  const stringValue = String(value);

  if (/^\d{2}\/\d{2}$/.test(stringValue)) {
    return stringValue;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return stringValue;
  }

  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear()).slice(-2);

  return `${month}/${year}`;
};

// Converts a warehouse location into readable aisle, rack, shelf, and bin labels
export const parseChips = location => {
  const parts = (location || '').split('-');

  if (parts.length < 4) {
    return [location || '-'];
  }

  return [
    `Aisle ${parts[0]}`,
    `Rack ${parts[1].replace('R', '')}`,
    `Shelf ${parts[2].replace('S', '')}`,
    `Bin ${parts[3].replace('B', '')}`,
  ];
};
