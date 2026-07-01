# Noah's Ark 智慧餐饮点餐系统

这是一个基于 **微信小程序前端 + Java Spring Boot 后端** 的餐饮点餐系统示例，覆盖顾客扫码点餐、购物车提交、订单查询和菜单接口。

## 模块说明

- `miniprogram/`：微信小程序顾客端，包含菜单、购物车和订单页面。
- `backend/`：Java Spring Boot REST API，提供菜单查询与订单创建/查询接口。
- `src/` 与 `index.html`：可在浏览器直接打开的产品演示页。

## 后端启动

```bash
cd backend
mvn spring-boot:run
```

默认接口地址：`http://localhost:8080/api`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/menu` | 查询分类与可售菜品 |
| POST | `/api/orders` | 创建订单 |
| GET | `/api/orders` | 查询订单列表 |

## 小程序运行

1. 使用微信开发者工具导入 `miniprogram/`。
2. 确认 `miniprogram/utils/api.js` 中的 `BASE_URL` 指向后端服务地址。
3. 在菜单页可通过扫码参数传入 `tableNo`，例如 `pages/menu/menu?tableNo=A01`。

## 后续可扩展

- 接入微信登录与 OpenID 绑定。
- 接入微信支付、支付回调和退款流程。
- 使用 MySQL 持久化分类、菜品、桌台和订单。
- 增加商家管理后台与后厨大屏。
