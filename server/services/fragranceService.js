const https = require('https');

const FRAGELLA_BASE_URL = 'https://api.fragella.com/api/v1';

class FragellaService {
  constructor() {
    this.apiKey = process.env.FRAGELLA_API_KEY;
    if (!this.apiKey) {
      console.warn('⚠️ FRAGELLA_API_KEY not set in environment variables');
    }
  }

  _request(endpoint, params = {}) {
    return new Promise((resolve, reject) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `${FRAGELLA_BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;

      const options = {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      };

      https.get(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 400) {
              reject(new Error(parsed.message || `API Error: ${res.statusCode}`));
            } else {
              resolve(parsed);
            }
          } catch (e) {
            reject(new Error('Invalid JSON response from Fragella API'));
          }
        });
      }).on('error', (err) => {
        reject(new Error(`Fragella API request failed: ${err.message}`));
      });
    });
  }

  async searchFragrances(search, limit = 10) {
    return this._request('/fragrances', { search, limit: Math.min(limit, 20) });
  }

  async getFragranceById(id) {
    return this._request('/fragrances', { search: id, limit: 1 });
  }

  async matchFragrances({ accords, top, middle, base, general, limit = 10 }) {
    const params = {};
    if (accords) params.accords = accords;
    if (top) params.top = top;
    if (middle) params.middle = middle;
    if (base) params.base = base;
    if (general) params.general = general;
    params.limit = Math.min(limit, 10);
    return this._request('/fragrances/match', params);
  }

  async getSimilarFragrances(name, limit = 10) {
    return this._request('/fragrances/similar', { name, limit: Math.min(limit, 10) });
  }

  async getBrandFragrances(brandName, limit = 10) {
    return this._request(`/brands/${encodeURIComponent(brandName)}`, { limit: Math.min(limit, 50) });
  }

  async searchNotes(search, limit = 10) {
    return this._request('/notes', { search, limit: Math.min(limit, 20) });
  }

  async searchAccords(search, limit = 10) {
    return this._request('/accords', { search, limit: Math.min(limit, 20) });
  }

  async getUsage() {
    return this._request('/usage');
  }
}

module.exports = new FragellaService();
