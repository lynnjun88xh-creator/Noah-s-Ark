const api = require('../../utils/api');

Page({
  data: { orders: [], highlightedOrderNo: '' },
  onLoad(options) { this.setData({ highlightedOrderNo: options.orderNo || '' }); },
  onShow() { this.loadOrders(); },
  async loadOrders() {
    try { this.setData({ orders: await api.getOrders() }); }
    catch (error) { wx.showToast({ title: '订单加载失败', icon: 'none' }); }
  },
});
