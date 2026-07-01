const api = require('../../utils/api');
const app = getApp();

Page({
  data: { items: [], totalAmount: 0, remark: '' },
  onShow() { this.refreshCart(); },
  refreshCart() {
    const items = app.globalData.cart;
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.setData({ items, totalAmount });
  },
  onRemarkInput(event) { this.setData({ remark: event.detail.value }); },
  async submitOrder() {
    if (!this.data.items.length) return wx.showToast({ title: '请先选择菜品', icon: 'none' });
    const payload = { tableNo: app.globalData.tableNo || 'A01', remark: this.data.remark, items: this.data.items };
    try {
      const order = await api.createOrder(payload);
      app.globalData.cart = [];
      wx.redirectTo({ url: `/pages/orders/orders?orderNo=${order.orderNo}` });
    } catch (error) {
      wx.showToast({ title: '下单失败', icon: 'none' });
    }
  },
});
