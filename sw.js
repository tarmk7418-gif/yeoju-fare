self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = {
    title: '📢 여주시 새 배차 알림',
    body: '새로운 배차 요청이 도착했습니다. 앱을 열어 확인하세요.',
    url: './index.html'
  };
  try {
    if (event.data) {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    }
  } catch (e) {
    if (event.data) payload.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png',
      vibrate: [400, 150, 400, 150, 600],
      tag: 'yeoju-dispatch-alert',
      renotify: true,
      requireInteraction: true,
      data: { url: payload.url || './index.html' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './index.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
