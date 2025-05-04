import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore instance
import { useNavigate } from 'react-router-dom';
import './chatroom.css';

const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  // Ensure the user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate('/login'); // Redirect if not logged in
    });
    return () => unsubscribe();
  }, [navigate]);

  // Load chat messages in real-time
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Handle sending a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        createdAt: new Date(),
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
      });
      setMessage(''); // Clear the input
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.'); // Display user-friendly error
    }
  };

  // Logout Functionality
  const handleLogout = () => {
    auth.signOut()
      .then(() => navigate('/login'))
      .catch((error) => console.error('Error logging out:', error));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center chatroom-container">
      <div className="backgroundc">
        <h1 className="heading">Chat Room</h1>
        <div className="chat">
          {messages.map((msg) => (
            <div key={msg.id} className={msg.uid === auth.currentUser.uid ? 'text-right' : 'text-left'}>
              <p className="text-sm text-gray-500">{msg.email}</p>
              <p className={msg.uid === auth.currentUser.uid ? 'bg-green-500 text-black' : 'bg-gray-300'}>
                {msg.text}
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="form">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input"
          />
          <button type="submit" className="button">
            Send
          </button>
        </form>
        <div className="active-users">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
