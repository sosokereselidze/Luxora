import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Use relative path to leverage Vite's proxy in development, or VITE_API_URL in production
    const URL = import.meta.env.MODE === 'development' ? window.location.origin : (import.meta.env.VITE_API_URL || window.location.origin);
    
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
