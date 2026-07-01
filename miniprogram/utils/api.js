const BASE_URL = 'http://localhost:8080/api';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${path}`,
      method: options.method || 'GET',
      data: options.data || {},
      success: ({ statusCode, data }) => {
        if (statusCode >= 200 && statusCode < 300) resolve(data);
        else reject(new Error(data?.message || `请求失败：${statusCode}`));
      },
      fail: reject,
    });
  });
}

module.exports = {
  getMenu: () => request('/menu'),
  createOrder: (payload) => request('/orders', { method: 'POST', data: payload }),
  getOrders: () => request('/orders'),
};
