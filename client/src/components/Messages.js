import React from 'react';
import styles from './Messages.module.css';

const Messages = () => {
  const messages = [
    {
      id: 1,
      company: "Tech Corp",
      avatar: "/api/placeholder/48/48",
      lastMessage: "Thanks for your interest! When are you available for an interview?",
      time: "2m ago",
      unread: true
    },
    {
      id: 2,
      company: "Startup Inc",
      avatar: "/api/placeholder/48/48",
      lastMessage: "Hi! We'd love to discuss the position with you.",
      time: "1h ago",
      unread: false
    }
  ];

  return (
    <div className={styles.messageContainer}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.messageCard} ${message.unread ? styles.messageCardUnread : styles.messageCardRead}`}
        >
          <div className={styles.messageContent}>
            <img src={message.avatar} alt="" className={styles.avatar} />
            <div className={styles.messageTextContainer}>
              <div className={styles.messageHeader}>
                <h3 className={styles.companyName}>{message.company}</h3>
                <span className={styles.messageTime}>{message.time}</span>
              </div>
              <p className={styles.lastMessage}>{message.lastMessage}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
