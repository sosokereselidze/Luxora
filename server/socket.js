let io;

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    io.on('connection', (socket) => {
      console.log('🔌 New client connected:', socket.id);

      socket.on('join-product', (productId) => {
        socket.join(`product-${productId}`);
        console.log(`👤 Client ${socket.id} joined product-${productId}`);
      });

      socket.on('leave-product', (productId) => {
        socket.leave(`product-${productId}`);
        console.log(`👤 Client ${socket.id} left product-${productId}`);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
