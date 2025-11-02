// src/components/NotificationPanel.jsx
import React from 'react';

export default function NotificationPanel({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return <div className="text-sm text-gray-400 p-4">No hay notificaciones</div>;
  }
  return (
    <div className="space-y-2 p-3">
      {notifications.map(n => (
        <div key={n.id} className={`p-3 rounded ${n.unread ? 'bg-gray-800' : 'bg-gray-900 text-gray-400'}`}>
          <div className="font-semibold text-gray-100">{n.title}</div>
          <div className="text-sm text-gray-400">{n.message}</div>
          <div className="text-xs text-gray-500 mt-1">{n.time}</div>
        </div>
      ))}
    </div>
  );
}
