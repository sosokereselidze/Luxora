const User = require('../models/User');
const Product = require('../models/Product');
const Fragrance = require('../models/Fragrance');
const Order = require('../models/Order');

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find().select('totalPrice status createdAt isPaid')
    ]);

    const totalRevenue = orders
      .filter(o => o.isPaid || o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentOrders = orders.filter(o => new Date(o.createdAt) >= sixMonthsAgo);

    const revenueByMonth = {};
    recentOrders.forEach(o => {
      const month = new Date(o.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!revenueByMonth[month]) revenueByMonth[month] = 0;
      if (o.isPaid || o.status === 'delivered') {
        revenueByMonth[month] += o.totalPrice;
      }
    });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      revenueByMonth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Users Management ─────────────────────────────────────────────────────────

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { role, name, email } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (role) user.role = role;
    if (name) user.name = name;
    if (email) user.email = email;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own admin account' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Reviews Management ───────────────────────────────────────────────────────

// @desc    Get all reviews across all products
// @route   GET /api/admin/reviews
exports.getAllReviews = async (req, res) => {
  try {
    const productsPromise = Product.find({ 'reviews.0': { $exists: true } })
      .select('name brand reviews image');
    const fragrancesPromise = Fragrance.find({ 'reviews.0': { $exists: true } })
      .select('name brand reviews image');

    const [products, fragrances] = await Promise.all([productsPromise, fragrancesPromise]);
    const allItems = [...products, ...fragrances];

    const reviews = [];
    allItems.forEach(item => {
      item.reviews.forEach(review => {
        reviews.push({
          _id: review._id,
          productId: item._id,
          productName: item.name,
          productBrand: item.brand,
          productImage: item.image,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          user: review.user,
          createdAt: review.createdAt,
          isFragrance: !!item.volume // Simple check to know it's from Fragrances collection if we ever need it
        });
      });
    });

    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:productId/:reviewId
exports.deleteReview = async (req, res) => {
  try {
    // Try finding in both collections
    let itemToUpdate = await Product.findById(req.params.productId);
    if (!itemToUpdate) {
      itemToUpdate = await Fragrance.findById(req.params.productId);
    }
    
    if (!itemToUpdate) return res.status(404).json({ message: 'Product or Fragrance not found' });

    itemToUpdate.reviews = itemToUpdate.reviews.filter(
      r => r._id.toString() !== req.params.reviewId
    );
    itemToUpdate.numReviews = itemToUpdate.reviews.length;
    itemToUpdate.rating = itemToUpdate.reviews.length
      ? itemToUpdate.reviews.reduce((acc, r) => acc + r.rating, 0) / itemToUpdate.reviews.length
      : 5;

    await itemToUpdate.save();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Payments / Revenue ───────────────────────────────────────────────────────

// @desc    Mark order as paid
// @route   PUT /api/admin/orders/:id/pay
exports.markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = Date.now();
    if (order.status === 'pending') order.status = 'processing';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });

    // Top products by revenue
    const productRevenue = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.product?.toString() || item.name;
        if (!productRevenue[key]) {
          productRevenue[key] = { name: item.name, revenue: 0, units: 0 };
        }
        productRevenue[key].revenue += item.price * item.quantity;
        productRevenue[key].units += item.quantity;
      });
    });

    const topProducts = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Daily orders for last 14 days
    const dailyData = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyData[key] = { orders: 0, revenue: 0 };
    }

    orders.forEach(order => {
      const d = new Date(order.createdAt);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyData[key] !== undefined) {
        dailyData[key].orders += 1;
        if (order.isPaid || order.status === 'delivered') {
          dailyData[key].revenue += order.totalPrice;
        }
      }
    });

    res.json({ topProducts, dailyData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
