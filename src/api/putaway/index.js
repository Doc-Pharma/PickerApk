import { request } from '../client';

const formatDate = iso => {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return iso;
  }
};

export const getPutAwayTask = async taskId => {
  const res = await request('GET', `/picker-putter-order/tasks/${taskId}`);
  const task = res?.data?.task
    ? { ...res.data.task, assigned: formatDate(res.data.task.assigned) }
    : res?.data?.task;
  const items = (res?.data?.items || []).map(item => ({
    ...item,
    name: item.name || item.sub || `Item ${item.id}`,
  }));
  return { ...res, data: { task, items } };
};

// QR format: "random,product_id,batch_number,expiry_date,dp_id,id"
// parts[0]=random  parts[1]=product_id  parts[2]=batch  parts[3]=expiry  parts[4]=dp_id  parts[5]=id
export const parsePutAwayQR = code => {
  const parts = (code || '').trim().split(',');
  const dpId = (parts[4] || '').trim();
  return {
    dpId,
    productId: parts[1] || '',
    batchNumber: parts[2] || '',
    expiryDate: parts[3] || '',
    itemId: parts[5] || '',
  };
};

export const scanPutAwayProduct = (itemId, dpId) =>
  request('POST', `/picker-putter-order/task/${itemId}/putaway/scan`, {
    qr_code_data: { dp_id: dpId },
  });

export const scanPutAwayLocation = (itemId, scannedLocationId) =>
  request('POST', `/picker-putter-order/task/${itemId}/putaway/scan-location`, {
    scanned_location: scannedLocationId,
  });

export const markTaskComplete = itemId =>
  request('POST', `/putaway/${itemId}/mark-complete`, {});
