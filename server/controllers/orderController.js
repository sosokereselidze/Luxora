const Order = require('../models/Order');
const socketIO = require('../socket');

// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalPrice } = req.body;
    const Product = require('../models/Product');

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Process items to ensure they exist in local DB and handle stock
    const processedItems = [];
    for (const item of items) {
      let product = await Product.findById(item.product);
      
      // If product not found by ID, it might be an external product being bought for the first time
      if (!product && item.productInfo) {
        // Normalize category
        let category = 'Unisex';
        const rawCategory = (item.productInfo.category || item.productInfo.Gender || '').toLowerCase();
        if (rawCategory.includes('men') && !rawCategory.includes('women')) category = 'Men';
        else if (rawCategory.includes('women')) category = 'Women';

        product = await Product.create({
          name: item.productInfo.name || item.productInfo.Name,
          brand: item.productInfo.brand || item.productInfo.Brand,
          description: item.productInfo.description || item.productInfo.Description || 'Purchased from explorer',
          price: Number(item.productInfo.price || item.productInfo.Price) || item.price,
          image: item.productInfo.image || item.productInfo['Image URL'] || item.image,
          category,
          volume: item.productInfo.volume || '100ml',
          stock: 49, // Starting with 50, but we're buying one now
        });
      }

      if (product) {
        // Decrement stock
        product.stock = Math.max(0, product.stock - item.quantity);
        product.sold = (product.sold || 0) + item.quantity;
        await product.save();

        processedItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: item.quantity
        });
      } else {
        // If still no product and no info, we might have to skip or error
        // For now, if it has a valid-looking name/price, we skip the DB check for the order item
        // but the Order model requires a valid ObjectId, so this would fail anyway.
        // So we'll return an error if we can't find/create it.
        return res.status(404).json({ message: `Product ${item.name} not found and cannot be initialized.` });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items: processedItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });


    // Notify Admins
    try {
      const io = socketIO.getIO();
      io.emit('new-order', {
        orderId: order._id,
        userName: req.user.name,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt
      });
    } catch (err) {
      console.error('Socket error in order:', err.message);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Check if order belongs to user or user is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status || order.status;
    if (req.body.status === 'delivered') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
