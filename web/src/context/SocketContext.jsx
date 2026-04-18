import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // In development mode, connect directly to the backend port (5000) to avoid Vite proxy WebSocket issues.
    // In production, use the environment API URL or fall back to the origin.
    const URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : (import.meta.env.VITE_API_URL || window.location.origin);
    
    const newSocket = io(URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
