const Order = require('../models/Order');
const bogService = require('../services/bogService');
const socketIO = require('../socket');

// @desc    Initiate BOG payment (iPay)
// @route   POST /api/bog/pay
exports.initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Security check: only the owner can pay for the order
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    const orderData = {
      intent: 'AUTHORIZE',
      items: order.items.map(item => ({
        unit_price: item.price,
        quantity: item.quantity,
        description: item.name
      })),
      locale: 'ka',
      shop_order_id: order._id.toString(),
      redirect_links: {
        success: `${process.env.FRONTEND_URL}/payment/success?orderId=${order._id}`,
        fail: `${process.env.FRONTEND_URL}/payment/fail?orderId=${order._id}`,
        cancel: `${process.env.FRONTEND_URL}/payment/cancel?orderId=${order._id}`
      },
      capture_method: 'AUTOMATIC'
    };

    const bogOrder = await bogService.createIpayOrder(orderData);
    
    // Save BOG order ID for tracking
    order.paymentResult = {
      id: bogOrder.id,
      status: bogOrder.status,
      update_time: new Date().toISOString()
    };
    await order.save();

    res.json({ checkoutUrl: bogOrder.redirect_links.checkout });
  } catch (error) {
    console.error('BOG Payment Initiation Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handle BOG webhook (callback)
// @route   POST /api/bog/webhook
exports.handleWebhook = async (req, res) => {
  try {
    const { event, shop_order_id, status, order_id } = req.body;
    console.log(`BOG Webhook Received: ${event} for order ${shop_order_id} with status ${status}`);

    // BOG requires 200 OK response
    res.sendStatus(200);

    const order = await Order.findById(shop_order_id);
    if (!order) {
      console.warn(`Order ${shop_order_id} not found for webhook callback`);
      return;
    }

    if (event === 'order.success' && status === 'SUCCESS') {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = 'processing'; // Move to processing after payment
      order.paymentResult = {
        id: order_id,
        status: status,
        update_time: new Date().toISOString()
      };
      await order.save();

      // Notify through socket if user is online
      try {
        const io = socketIO.getIO();
        io.emit('payment-success', { orderId: order._id });
      } catch (err) {
        console.error('Socket notification error:', err.message);
      }
    } else if (status === 'FAILED') {
      // Keep track of failed attempts if needed
      order.paymentResult = {
        id: order_id,
        status: 'FAILED',
        update_time: new Date().toISOString()
      };
      await order.save();
      
      try {
        const io = socketIO.getIO();
        io.emit('payment-failed', { orderId: order._id });
      } catch (err) {
        console.error('Socket notification error:', err.message);
      }
    }
  } catch (error) {
    console.error('BOG Webhook Processing Error:', error.message);
  }
};

// @desc    Get order status from BOG
// @route   GET /api/bog/status/:orderId
exports.getPaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.paymentResult || !order.paymentResult.id) {
      return res.status(400).json({ message: 'No payment initiated for this order' });
    }

    const bogStatus = await bogService.getOrderStatus(order.paymentResult.id);
    
    // Update local state if BOG says it's success but we haven't received webhook yet
    if (bogStatus.status === 'SUCCESS' && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = 'processing';
      order.paymentResult.status = 'SUCCESS';
      order.paymentResult.update_time = new Date().toISOString();
      await order.save();
    }

    res.json(bogStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
