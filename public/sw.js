// Service Worker for Push Notifications

self.addEventListener("push", (event) => {
  const options = {
    body: "🌱 식물이 당신에게 할 말이 있어요!",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    vibrate: [200, 100, 200],
    tag: "plant-notification",
    renotify: true,
    data: { url: "/home" },
  };

  event.waitUntil(
    self.registration.showNotification("MyLittleGarden", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/home";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
