const axios = require('axios');

class BogService {
  constructor() {
    this.clientId = process.env.BOG_CLIENT_ID;
    this.clientSecret = process.env.BOG_CLIENT_SECRET;
    this.authUrl = 'https://api.bog.ge/v1/oauth2/token';
    this.ipayUrl = 'https://ipay.ge/api/checkout/orders';
    this.accessToken = null;
    this.tokenExpiresAt = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiresAt > Date.now()) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error('Bank of Georgia credentials are not configured');
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    try {
      const response = await axios.post(
        this.authUrl,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = Date.now() + (response.data.expires_in * 1000) - 60000; // Subtract 1 minute for safety
      return this.accessToken;
    } catch (error) {
      console.error('BOG Auth Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Bank of Georgia');
    }
  }

  async createIpayOrder(orderData) {
    const token = await this.getAccessToken();
    
    try {
      const response = await axios.post(
        this.ipayUrl,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('BOG iPay Order Error:', error.response?.data || error.message);
      throw new Error('Failed to create Bank of Georgia payment order');
    }
  }

  async getOrderStatus(orderId) {
    const token = await this.getAccessToken();
    
    try {
      const response = await axios.get(
        `${this.ipayUrl}/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('BOG Order Status Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch Bank of Georgia order status');
    }
  }
}

module.exports = new BogService();
