const menuItems = [
  { id: 1, name: '方舟招牌牛肉饭', price: 28, sales: 392, tag: '招牌', image: '🍛' },
  { id: 2, name: '黑椒鸡腿套餐', price: 32, sales: 268, tag: '套餐', image: '🍗' },
  { id: 3, name: '鲜虾云吞面', price: 26, sales: 187, tag: '热销', image: '🍜' },
  { id: 4, name: '柠檬气泡茶', price: 12, sales: 516, tag: '饮品', image: '🥤' },
];

const cart = new Map();
const menuList = document.querySelector('#menu-list');
const cartSummary = document.querySelector('#cart-summary');

function formatCurrency(value) {
  return `¥${value.toFixed(2)}`;
}

function updateCartSummary() {
  const items = [...cart.values()];
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  cartSummary.textContent = count ? `${count} 件商品 · ${formatCurrency(total)}` : '购物车为空';
}

function renderMenu() {
  menuList.innerHTML = menuItems
    .map(
      (item) => `
        <article class="dish-card">
          <div class="dish-image" aria-hidden="true">${item.image}</div>
          <div>
            <strong>${item.name}</strong>
            <span>${item.tag} · 月售 ${item.sales}</span>
            <b>${formatCurrency(item.price)}</b>
          </div>
          <button type="button" data-id="${item.id}">+</button>
        </article>
      `,
    )
    .join('');
}

menuList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;
  const dish = menuItems.find((item) => item.id === Number(button.dataset.id));
  const current = cart.get(dish.id) || { ...dish, quantity: 0 };
  current.quantity += 1;
  cart.set(dish.id, current);
  updateCartSummary();
});

renderMenu();
updateCartSummary();
