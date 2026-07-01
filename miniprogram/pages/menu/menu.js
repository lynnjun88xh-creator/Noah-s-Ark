const api = require('../../utils/api');
const app = getApp();

Page({
  data: { categories: [], activeCategoryId: 0, dishes: [], loading: true },
  onLoad(options) {
    if (options.tableNo) app.globalData.tableNo = options.tableNo;
    this.loadMenu();
  },
  async loadMenu() {
    try {
      const { categories, dishes } = await api.getMenu();
      this.setData({ categories, dishes, activeCategoryId: categories[0]?.id || 0, loading: false });
    } catch (error) {
      wx.showToast({ title: '菜单加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },
  switchCategory(event) { this.setData({ activeCategoryId: Number(event.currentTarget.dataset.id) }); },
  addToCart(event) {
    const dish = this.data.dishes.find((item) => item.id === Number(event.currentTarget.dataset.id));
    const cartItem = app.globalData.cart.find((item) => item.dishId === dish.id);
    if (cartItem) cartItem.quantity += 1;
    else app.globalData.cart.push({ dishId: dish.id, name: dish.name, price: dish.price, quantity: 1 });
    wx.showToast({ title: '已加入购物车', icon: 'success' });
  },
});
