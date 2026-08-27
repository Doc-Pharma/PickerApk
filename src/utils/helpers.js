// Formats an expiry date as MM/YY.
// Accepts an already-formatted MM/YY string, DD/MM/YYYY, or anything
// Date can parse. Returns '' when there is nothing to show.
export const formatExpiryDate = value => {
  if (!value) return '';

  const stringValue = String(value).trim();

  if (/^\d{1,2}\/\d{2}$/.test(stringValue)) {
    return stringValue;
  }

  const ddmmyyyy = stringValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (ddmmyyyy) {
    return `${ddmmyyyy[2].padStart(2, '0')}/${ddmmyyyy[3].slice(-2)}`;
  }

  const date = new Date(stringValue);

  if (Number.isNaN(date.getTime())) {
    return stringValue;
  }

  // UTC getters: the API sends date-only strings, which parse as UTC
  // midnight and would roll back a day on negative-offset devices.
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear()).slice(-2);

  return `${month}/${year}`;
};

// Converts a warehouse location into readable aisle, rack, shelf, and bin labels
export const parseChips = location => {
  const parts = (location || '').split('-');

  if (parts.length < 4) {
    return location ? [location] : [];
  }

  return [
    `Aisle ${parts[0]}`,
    `Rack ${parts[1].replace('R', '')}`,
    `Shelf ${parts[2].replace('S', '')}`,
    `Bin ${parts[3].replace('B', '')}`,
  ];
};
