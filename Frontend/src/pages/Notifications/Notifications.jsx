
import { useEffect, useState } from "react";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("minasToken");

      const response = await fetch(
        "http://localhost:3000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de charger les notifications."
        );
      }

      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  let previousNotificationIds = null;
  let audioContext = null;

  const playNotificationSound = () => {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioContext) {
        audioContext = new AudioContextClass();
      }

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        880,
        audioContext.currentTime
      );

      gain.gain.setValueAtTime(0.001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.12,
        audioContext.currentTime + 0.03
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.25
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.25);
    } catch (error) {
      console.error("Impossible de jouer le son :", error);
    }
  };

  const checkNotifications = async () => {
    try {
      const token = localStorage.getItem("minasToken");
      if (!token) return;

      const response = await fetch(
        "http://localhost:3000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) return;

      const latestNotifications = data.notifications || [];
      const currentIds = latestNotifications.map((n) => n._id);

      if (previousNotificationIds !== null) {
        const hasNewNotification = latestNotifications.some(
          (notification) =>
            !previousNotificationIds.includes(notification._id)
        );

        if (hasNewNotification) {
          playNotificationSound();
        }
      }

      previousNotificationIds = currentIds;
      setNotifications(latestNotifications);
      setError("");
      setLoading(false);
    } catch (error) {
      console.error("Erreur de vérification des notifications :", error);
    }
  };

  checkNotifications();

  const intervalId = window.setInterval(checkNotifications, 5000);

  return () => {
    window.clearInterval(intervalId);

    if (audioContext) {
      audioContext.close();
    }
  };
}, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("minasToken");

      const response = await fetch(
        `http://localhost:3000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de marquer comme lue.");
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("minasToken");

      const response = await fetch(
        "http://localhost:3000/api/notifications/read-all",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de modifier les notifications."
        );
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <p className="notifications-message">Chargement...</p>;
  }

  if (error) {
    return <p className="notifications-error">{error}</p>;
  }

  return (
    <main className="notifications-page">
      <h1>Notifications</h1>

      <p className="notifications-subtitle">
        Retrouvez ici les mises à jour concernant vos publications.
      </p>

      {notifications.length > 0 && (
        <button
          className="approve-button"
          onClick={markAllAsRead}
          disabled={notifications.every(
            (notification) => notification.isRead
          )}
        >
          Tout marquer comme lu
        </button>
      )}

      {notifications.length === 0 ? (
        <p>Vous n’avez pas encore de notification.</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <article
              className="notification-card"
              key={notification._id}
            >
<div className="notification-heading">
  <span className={`notification-type notification-type-${notification.type}`}>
    {notification.type === "new_post"
      ? "Nouvelle publication"
      : notification.type === "post_liked"
        ? "J’aime"
        : notification.type === "post_commented"
          ? "Commentaire"
          : notification.type === "post_approved"
            ? "Publication approuvée"
            : notification.type === "post_rejected"
              ? "Publication rejetée"
              : "Notification"}
  </span>
</div>

<p>{notification.message}</p>
              <p className="notification-author">
                {new Date(notification.createdAt).toLocaleString("fr-FR")}
              </p>

              <div className="notification-actions">
                <span
                  className={
                    notification.isRead ? "" : "pending-status"
                  }
                >
                  {notification.isRead ? "Lue" : "Non lue"}
                </span>

                {!notification.isRead && (
                  <button
                    className="approve-button"
                    onClick={() => markAsRead(notification._id)}
                  >
                    Marquer comme lue
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Notifications;
