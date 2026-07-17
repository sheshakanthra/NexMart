import { useState } from 'react';

// TODO Phase 4: Wire to notificationService + realtime subscription
// data shape: Notification[] — { id, createdAt, read, title, body, kind }
export function useNotifications(userId) {
  const [loading] = useState(false);
  const [error]   = useState(null);
  const [data]    = useState(null);

  const refetch = () => {};

  return { loading, error, data, refetch };
}
