import { request } from '../client';

const formatDate = iso => {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
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

export const getTasks = async () => {
  const res = await request('GET', '/picker-putter-order/tasks/pending');
  const map = t => ({
    ...t,
    type: (t.type || t.task_type || '').toLowerCase(),
    date: formatDate(t.date),
  });
  return {
    ...res,
    data: {
      active: (res?.data?.active || []).map(map),
      pending: (res?.data?.pending || []).map(map),
    },
  };
};
