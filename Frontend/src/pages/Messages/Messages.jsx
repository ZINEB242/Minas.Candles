
import { useCallback, useEffect, useState } from "react";
import "./Messages.css";

const API = "http://localhost:3000/api";

const Messages = () => {
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("minasToken");
  const user = JSON.parse(localStorage.getItem("minasUser") || "{}");
  const isAdmin = user?.role === "admin";
  const currentUserId = user?._id || user?.id;
console.log("Utilisateur connecté :", user);
console.log("Identifiant utilisateur :", currentUserId);
  const loadConversations = useCallback(async () => {
    if (!token) {
      setError("Connectez-vous pour accéder à la messagerie.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de charger les conversations.");
      }

      const list = data.conversations || [];
      setConversations(list);

      if (!isAdmin) {
        const supportResponse = await fetch(`${API}/messages/support`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const supportData = await supportResponse.json();

        if (!supportResponse.ok) {
          throw new Error(supportData.message || "Impossible de trouver l’administrateur.");
        }

        const admin = supportData.admin;
        const existingConversation = list.find(
          (conversation) => conversation.user._id === admin._id
        );

        setSelectedUser((previous) => {
          if (previous?._id === admin._id) return previous;
          return existingConversation?.user || admin;
        });
      } else {
        setSelectedUser((previous) => {
          if (previous && list.some((item) => item.user._id === previous._id)) {
            return list.find((item) => item.user._id === previous._id).user;
          }

          return list[0]?.user || null;
        });
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin]);

  const loadMessages = useCallback(async () => {
    if (!token || !selectedUser?._id) {
      setMessages([]);
      return;
    }

    try {
      const response = await fetch(
        `${API}/messages/${selectedUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de charger les messages.");
      }

      setMessages(data.messages || []);
      await loadConversations();
    } catch (err) {
      setError(err.message || "Impossible de charger les messages.");
    }
  }, [token, selectedUser?._id, loadConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSend = async (event) => {
    event.preventDefault();

    if (!message.trim() || !selectedUser?._id || sending) return;

    setSending(true);
    setError("");

    try {
      const response = await fetch(`${API}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: selectedUser._id,
          content: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible d’envoyer le message.");
      }

      setMessage("");
      await loadMessages();
      await loadConversations();
    } catch (err) {
      setError(err.message || "Impossible d’envoyer le message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="messages-page">
      <header className="messages-header">
        <div>
          <h1>Messagerie</h1>
          <p>Échangez avec l’équipe Minas Candles.</p>
        </div>
      </header>

      <section className="messages-layout">
        <aside className="messages-sidebar">
          <h2>Conversations</h2>

          {loading && <p className="messages-empty">Chargement...</p>}

          {!loading && conversations.length === 0 && isAdmin && (
            <p className="messages-empty">
              Aucun client ne vous a encore écrit.
            </p>
          )}

          {!loading && !isAdmin && selectedUser && (
            <button
              type="button"
              className="messages-conversation-item"
              onClick={() => setSelectedUser(selectedUser)}
            >
              {selectedUser.name || "Équipe Minas Candles"}
            </button>
          )}

          {isAdmin &&
            conversations.map((conversation) => (
              <button
                type="button"
                key={conversation.user._id}
                className={`messages-conversation-item ${
                  selectedUser?._id === conversation.user._id ? "active" : ""
                }`}
                onClick={() => setSelectedUser(conversation.user)}
              >
                <span>{conversation.user.name || "Client"}</span>
                {conversation.unreadCount > 0 && (
                  <span className="messages-unread-count">
                    {conversation.unreadCount}
                  </span>
                )}
              </button>
            ))}
        </aside>

        <section className="messages-conversation">
          {error && <p className="messages-error">{error}</p>}

          {selectedUser ? (
            <>
              <div className="messages-chat-header">
                <h2>{selectedUser.name || "Équipe Minas Candles"}</h2>
              </div>

              <div className="messages-chat-body">
                {messages.length === 0 && (
                  <p className="messages-empty">
                    Aucun message pour le moment. Commencez la conversation !
                  </p>
                )}

                {messages.map((item) => {
                  const senderId =
                    typeof item.sender === "string"
                      ? item.sender
                      : item.sender?._id;

                  const isMine = senderId === currentUserId;

                  return (
                    <div
                      key={item._id}
                      className={`messages-bubble ${
                        isMine ? "mine" : "theirs"
                      }`}
                    >
                      <p>{item.content}</p>
                      <small>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString("fr-FR", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : ""}
                      </small>
                    </div>
                  );
                })}
              </div>

              <form className="messages-composer" onSubmit={handleSend}>
                <input
                  type="text"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Écrivez votre message..."
                  aria-label="Votre message"
                  maxLength={2000}
                />

                <button
                  type="submit"
                  disabled={!message.trim() || sending}
                >
                  {sending ? "Envoi..." : "Envoyer"}
                </button>
              </form>
            </>
          ) : (
            <div className="messages-welcome">
              <div className="messages-welcome-icon">✉</div>
              <h2>Bienvenue dans votre messagerie</h2>
              <p>
                {isAdmin
                  ? "Les conversations avec vos clients apparaîtront ici."
                  : "Retrouvez ici vos échanges avec Minas Candles."}
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Messages;
