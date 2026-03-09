import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
      checkExistingSubscription();
    }
  }, []);

  const checkExistingSubscription = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setIsSubscribed(!!sub);
    } catch {
      setIsSubscribed(false);
    }
  };

  const subscribe = useCallback(async () => {
    if (!isSupported) return false;

    try {
      // Request notification permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") return false;

      // Get VAPID public key from server
      const { data: vapidData, error: vapidErr } = await supabase.functions.invoke(
        "push-subscribe",
        { body: null, method: "GET" }
      );

      // Fallback: use fetch directly with query param
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const resp = await fetch(
        `https://${projectId}.supabase.co/functions/v1/push-subscribe?action=get_vapid_key`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      const keyData = await resp.json();
      const vapidPublicKey = keyData.vapidPublicKey;

      if (!vapidPublicKey) {
        console.error("Failed to get VAPID key");
        return false;
      }

      // Convert base64url to Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

      // Subscribe to push
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      // Send subscription to server
      const subJson = subscription.toJSON();
      const { error } = await supabase.functions.invoke("push-subscribe?action=subscribe", {
        body: {
          subscription: {
            endpoint: subJson.endpoint,
            keys: {
              p256dh: subJson.keys?.p256dh,
              auth: subJson.keys?.auth,
            },
          },
        },
      });

      if (error) {
        console.error("Subscribe error:", error);
        return false;
      }

      setIsSubscribed(true);
      return true;
    } catch (e) {
      console.error("Push subscription error:", e);
      return false;
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await supabase.functions.invoke("push-subscribe?action=unsubscribe", {
          body: { endpoint: sub.endpoint },
        });
        await sub.unsubscribe();
      }
      setIsSubscribed(false);
      return true;
    } catch (e) {
      console.error("Unsubscribe error:", e);
      return false;
    }
  }, []);

  return { isSupported, isSubscribed, permission, subscribe, unsubscribe };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}
