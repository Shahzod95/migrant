import React, { useEffect, useState } from 'react';

import eruda from "eruda";

const ALLOWED_USERS = [482569855, 98765432];
const API_ENDPOINT = "http://localhost:8000/send/";

const App = () => {
  const [tg, setTg] = useState(null);
  const [message, setMessage] = useState('');
  const [userAllowed, setUserAllowed] = useState(false);

  useEffect(() => {
    eruda.init();
    const telegram = window.Telegram.WebApp;
    telegram.ready();
    telegram.expand();
    setTg(telegram);

    const userId = telegram.initDataUnsafe?.user?.id;
    if (ALLOWED_USERS.includes(userId)) {
      setUserAllowed(true);
    }
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    console.log("INit Data:", tg?.initData);

    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          initData: tg?.initData,
        }),
      });

      tg.close(); 
    } catch (error) {
      alert('Xatolik yuz berdi.');
      console.error(error);
    }
  };

  if (!userAllowed) {
    return <p>🚫 Sizga ruxsat berilmagan.</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>📨 Xabar yuborish</h3>
      <textarea
        style={{ width: '100%', height: 100, fontSize: 16 }}
        placeholder="Xabarni kiriting..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        style={{
          marginTop: 10,
          padding: '10px 20px',
          fontSize: 16,
          backgroundColor: '#2cab37',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
        onClick={handleSend}
      >
        Yuborish
      </button>
    </div>
  );
};

export default App;
