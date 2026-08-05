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

export const getPickingOrder = async orderId => {
  const res = await request('GET', `/picker-putter-order/tasks/${orderId}`);
  const raw = res?.data?.task || res?.data?.order || res?.order || {};
  const order = {
    ...raw,
    orderType: raw.orderType || raw.order_service_type || raw.order_type || '—',
    assigned: formatDate(raw.assigned),
    totalSkus: raw.totalSkus ?? raw.total_skus ?? 0,
    partner_id: raw.partner_id ?? null,
  };
  const items = (res?.data?.items || res?.items || []).map(item => ({
    ...item,
    name: item.name || item.dp_id || '—',
    location: item.location_name || item.location || item.bin_location || '',
    product_id: item.product_id ?? null,
  }));
  return { order, items };
};

// POST /picker-putter-order/mark-picked-up-for-item/:itemId
export const markItemPickedUp = (itemId, payload) =>
  request(
    'POST',
    `/picker-putter-order/mark-picked-up-for-item/${itemId}`,
    payload,
  );

// POST /picker-putter-order/mark-picker-task-complete
export const markTaskComplete = pickerPutterOrderId =>
  request('POST', `/picker-putter-order/mark-picker-task-complete`, {
    picker_putter_order_id: pickerPutterOrderId,
  });

// GET /picker-putter-order/get-all-batch-for-a-product?product_id=...&partner_id=...
export const getProductBatches = (productId, partnerId) =>
  request('GET', `/picker-putter-order/get-all-batch-for-a-product`, null, {
    product_id: productId,
    ...(partnerId ? { partner_id: partnerId } : {}),
  });
