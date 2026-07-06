import { request } from '../client';

export const getPastOrders = async () => {
  const res = await request('GET', '/picker-putter-order/tasks/completed');
  // Response: { data: { data: [...], total_orders, total_picking_order, total_putaway_order } }
  const list = res?.data?.data || res?.data || [];
  const orders = list.map(t => ({
    ...t,
    id: t.order_number || t.id,
    task_id: t.task_id,
    type: (t.task_type || t.type || '')
      .toLowerCase()
      .replace('_', '')
      .includes('put')
      ? 'putaway'
      : 'picking',
    completed_at: t.updated_at || t.created_at || t.date,
    items: t.skus ?? t.total ?? 0,
  }));
  return {
    ...res,
    data: orders,
    totals: {
      total: res?.data?.total_orders ?? orders.length,
      picking: res?.data?.total_picking_order ?? 0,
      putaway: res?.data?.total_putaway_order ?? 0,
    },
  };
};

export const getOrderDetail = async id => {
  const res = await request('GET', `/picker-putter-order/tasks/${id}`);
  const task = res?.data?.task || {};
  const rawItems = res?.data?.items || [];
  const taskTypeLower = (task.task_type || task.type || '')
    .toLowerCase()
    .replace('_', '');
  return {
    ...res,
    data: {
      id: task.order_number || task.id,
      type: taskTypeLower.includes('put') ? 'putaway' : 'picking',
      invoice_id: task.order_number || task.invoice,
      completed_at: task.updated_at || task.assigned,
      order_type: task.order_service_type || task.order_type || task.orderType,
      items: rawItems.length,
      items_list: rawItems.map(item => ({
        name:
          item.name ||
          item.product_name ||
          item.sub ||
          item.dp_id ||
          `Item ${item.id}`,
        qty: item.qty ?? 0,
        batch: item.batch_number || item.batch_no || '',
        expiry: item.expiry_date || item.exp_date || '',
      })),
    },
  };
};
