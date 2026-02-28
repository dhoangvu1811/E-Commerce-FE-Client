# 🛒 Client E-Commerce — Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.6-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socket.io)](https://socket.io/)

Giao diện người dùng (Customer-facing) cho nền tảng thương mại điện tử. Được xây dựng với **Next.js 16 App Router**, **React 19**, **Redux Toolkit** và **Tailwind CSS**. Hỗ trợ realtime notifications qua **Socket.IO**, xác thực JWT + OAuth, quản lý giỏ hàng guest/authenticated, checkout đầy đủ với voucher & địa chỉ giao hàng.

---

## 📑 Mục lục

- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Kiến trúc dự án](#-kiến-trúc-dự-án)
- [Hệ thống Route](#-hệ-thống-route)
- [Components](#-components)
- [Redux Store](#-redux-store)
- [API Layer](#-api-layer)
- [Services](#-services)
- [Socket.IO Realtime](#-socketio-realtime)
- [Xác thực & Phân quyền](#-xác-thực--phân-quyền)
- [Giỏ hàng & Checkout](#-giỏ-hàng--checkout)
- [Biến môi trường](#-biến-môi-trường)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Scripts](#-scripts)
- [Tài liệu](#-tài-liệu)

---

## ✨ Tính năng chính

| # | Tính năng | Mô tả |
|---|-----------|-------|
| 1 | **Catalog & Sản phẩm** | Danh sách sản phẩm với filter (giá, danh mục, rating, tìm kiếm), pagination, sắp xếp |
| 2 | **Chi tiết sản phẩm** | Gallery nhiều ảnh, preview slider, thông tin chi tiết, chọn số lượng, thêm vào giỏ/wishlist |
| 3 | **Quick View** | Modal xem nhanh sản phẩm không cần chuyển trang |
| 4 | **Giỏ hàng thông minh** | Guest cart (localStorage + TTL 7 ngày) ↔ Server cart (authenticated), auto sync khi login |
| 5 | **Cart Sidebar** | Mini cart slide-in từ phải, cập nhật số lượng, xoá sản phẩm |
| 6 | **Checkout đầy đủ** | Chọn/tạo địa chỉ giao hàng, áp voucher giảm giá, chọn phương thức thanh toán, xác nhận đơn |
| 7 | **Quản lý đơn hàng** | Danh sách đơn, chi tiết đơn, lọc theo trạng thái, huỷ đơn, theo dõi thanh toán |
| 8 | **Voucher & Mã giảm giá** | Xem danh sách voucher hoạt động, copy mã, countdown hết hạn, thanh trạng progress sử dụng |
| 9 | **Wishlist** | Danh sách yêu thích (local, Redux-only) |
| 10 | **Xác thực đa kênh** | Đăng nhập/đăng ký email + OAuth (Google, Facebook), xác minh email, gửi lại mã xác thực |
| 11 | **Hồ sơ người dùng** | Cập nhật profile, upload avatar (Cloudinary), đổi mật khẩu |
| 12 | **Quản lý phiên** | Xem danh sách phiên đăng nhập, thu hồi phiên từ xa |
| 13 | **Địa chỉ giao hàng** | CRUD đầy đủ, đặt mặc định, sử dụng trong checkout |
| 14 | **Thông báo realtime** | Socket.IO push notification, lưu DB, đánh dấu đã đọc, xoá |
| 15 | **Blog** | Danh sách bài viết, chi tiết blog |
| 16 | **Responsive** | Giao diện tương thích mobile/tablet/desktop |
| 17 | **SEO-friendly** | Next.js App Router với metadata, SSR/SSG |

---

## 🛠 Công nghệ sử dụng

### Core

| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| **Next.js** | 16.x | React framework (App Router, SSR/SSG) |
| **React** | 19.x | UI library |
| **TypeScript** | 5.2 | Type safety |
| **Tailwind CSS** | 3.3 | Utility-first CSS |

### State Management & Data Fetching

| Thư viện | Phiên bản | Vai trò |
|----------|-----------|---------|
| **Redux Toolkit** | 2.6 | Global state management |
| **react-redux** | 9.2 | React bindings cho Redux |
| **Axios** | 1.13 | HTTP client với interceptors |

### Realtime & Forms

| Thư viện | Phiên bản | Vai trò |
|----------|-----------|---------|
| **socket.io-client** | 4.8 | WebSocket realtime |
| **react-hook-form** | 7.71 | Form management |
| **zod** | 4.3 | Schema validation |

### UI Components

| Thư viện | Phiên bản | Vai trò |
|----------|-----------|---------|
| **Swiper** | 10.2 | Carousel/Slider |
| **@mui/icons-material** | 7.3 | Material Design icons |
| **@mui/material** | 7.3 | MUI components |
| **react-hot-toast** | 2.4 | Toast notifications |
| **date-fns** | 4.1 | Date formatting |
| **clsx / classnames / tailwind-merge** | — | Conditional CSS classes |

---

## 📁 Kiến trúc dự án

```
src/
├── apis/                          # API layer
│   ├── axiosInstance.ts           # Axios instance + interceptors (auto refresh token)
│   ├── endpoints.ts               # Tất cả API endpoint paths (constant object)
│   └── index.ts                   # Barrel exports
│
├── app/                           # Next.js App Router
│   ├── (site)/                    # Site layout group
│   │   ├── layout.tsx             # Root: Redux → CartHydration → Socket → Contexts → Header/Footer
│   │   ├── page.tsx               # Trang chủ
│   │   ├── (pages)/               # Các trang con (xem phần Route)
│   │   └── blogs/                 # Blog pages
│   ├── context/                   # React Contexts
│   │   ├── QuickViewModalContext.tsx
│   │   ├── CartSidebarContext.tsx
│   │   └── PreviewSliderContext.tsx
│   ├── css/                       # Global CSS
│   └── fonts/                     # Custom fonts
│
├── components/                    # React Components
│   ├── Home/                      # Trang chủ (Hero, Categories, NewArrivals, BestSeller, ...)
│   ├── Header/                    # Header chính (mega search, nav, cart badge, notifications)
│   ├── Footer/                    # Footer
│   ├── Shop/                      # Danh sách sản phẩm + filter sidebar
│   ├── ShopDetails/               # Chi tiết sản phẩm (gallery, info, add to cart)
│   ├── Cart/                      # Trang giỏ hàng
│   ├── Checkout/                  # Checkout flow (7 sub-components)
│   ├── Auth/                      # Đăng nhập, đăng ký, xác minh email
│   ├── MyAccount/                 # Dashboard tài khoản (6 tabs)
│   ├── Vouchers/                  # Danh sách voucher
│   ├── Orders/                    # Chi tiết đơn hàng
│   ├── Wishlist/                  # Danh sách yêu thích
│   ├── Common/                    # Shared (ProductItem, QuickView, CartSidebar, Pagination, ...)
│   ├── Blog/, BlogDetails/        # Blog components
│   ├── Contact/                   # Trang liên hệ
│   ├── Error/                     # Error pages
│   ├── MailSuccess/               # Xác minh email thành công
│   └── providers/                 # Provider components
│       ├── CartHydration.tsx      # Load guest cart từ localStorage sau mount
│       ├── SocketProvider.tsx     # Socket.IO auto-connect/disconnect
│       └── ToastProvider.tsx      # react-hot-toast Toaster
│
├── redux/                         # Redux Toolkit
│   ├── store.ts                   # Store config (11 reducers + middleware)
│   ├── provider.tsx               # ReduxProvider wrapper
│   ├── slices/                    # 11 Redux slices
│   └── middleware/                # Cart listener middleware
│
├── services/                      # API service layer
│   ├── auth.service.ts            # Authentication
│   ├── product.service.ts         # Sản phẩm & danh mục
│   ├── cart.service.ts            # Giỏ hàng
│   ├── order.service.ts           # Đơn hàng
│   ├── voucher.service.ts         # Voucher
│   ├── user.service.ts            # User profile & sessions
│   ├── shippingAddress.service.ts # Địa chỉ giao hàng
│   ├── notification.service.ts    # Thông báo
│   └── index.ts                   # Barrel exports
│
├── types/                         # TypeScript types
│   ├── api.type.ts                # ApiResponse, ApiError, PaginationInfo
│   ├── auth.type.ts               # User, LoginRequest, RegisterRequest, ...
│   ├── product.type.ts            # Product, Category, ProductFilters
│   ├── order.type.ts              # Order, CreateOrderPayload, OrderFilters
│   ├── voucher.type.ts            # Voucher, VerifyVoucherPayload, VoucherState
│   ├── cart.type.ts               # Cart types
│   ├── notification.type.ts       # Notification, NotificationFilters
│   ├── shippingAddress.type.ts    # ShippingAddressItem, payloads
│   ├── socket.type.ts             # Socket event payloads + SOCKET_EVENTS enum
│   ├── blog.type.ts               # Blog types
│   └── sidebar.type.ts            # Sidebar types
│
├── hooks/                         # Custom hooks (hiện trống — useSocket nằm trong SocketProvider)
│
└── utils/                         # Utility functions
    └── formatCurrency.ts          # Format tiền VND
```

---

## 🗺 Hệ thống Route

### Layout Wrapper

```
ReduxProvider → CartHydration → SocketProvider → QuickViewContext → CartSidebarContext → PreviewSliderContext
    └── Header
    └── {children}   ← Page content
    └── Footer
    └── QuickViewModal + CartSidebar (global overlays)
```

### Danh sách Routes

| Route | Component | Mô tả | Auth |
|-------|-----------|-------|------|
| `/` | `Home/*` | Trang chủ (Hero, Categories, NewArrivals, BestSeller, Countdown, Promo, Blog) | — |
| `/signin` | `Auth/Signin` | Đăng nhập (email + OAuth) | Guest |
| `/signup` | `Auth/Signup` | Đăng ký tài khoản | Guest |
| `/verify-account` | `Auth/VerifyAccount` | Xác minh email qua link | Guest |
| `/resend-verification` | `Auth/ResendVerification` | Gửi lại email xác thực | Guest |
| `/mail-success` | `MailSuccess` | Thông báo gửi email thành công | — |
| `/oauth-success` | — | Callback OAuth thành công | — |
| `/oauth-failure` | — | Callback OAuth thất bại | — |
| `/shop` | `Shop/*` | Danh sách sản phẩm + filter (giá, danh mục, rating, search) | — |
| `/shop-details/[id]` | `ShopDetails/*` | Chi tiết sản phẩm (gallery, tabs, add to cart) | — |
| `/cart` | `Cart/*` | Giỏ hàng đầy đủ | — |
| `/checkout` | `Checkout/*` | Checkout flow (địa chỉ, voucher, thanh toán) | ✅ |
| `/checkout-success` | — | Đặt hàng thành công | ✅ |
| `/wishlist` | `Wishlist/*` | Danh sách yêu thích | — |
| `/my-account` | `MyAccount/*` | Dashboard tài khoản (6 tabs) | ✅ |
| `/my-orders/[id]` | `Orders/*` | Chi tiết đơn hàng | ✅ |
| `/vouchers` | `Vouchers/*` | Danh sách voucher hoạt động | — |
| `/contact` | `Contact/*` | Liên hệ | — |
| `/blogs` | `Blog/*` | Danh sách bài viết | — |
| `/blogs/[id]` | `BlogDetails/*` | Chi tiết bài viết | — |
| `/error` | `Error/*` | Trang lỗi | — |

---

## 🧩 Components

### Trang chủ (`Home/`)

| Component | Chức năng |
|-----------|-----------|
| `Hero` | Banner chính với slider |
| `Categories` | Danh mục sản phẩm nổi bật |
| `NewArrivals` | Sản phẩm mới nhất |
| `BestSeller` | Sản phẩm bán chạy |
| `Countdown` | Đếm ngược flash sale |
| `PromoBanner` | Banner khuyến mãi |
| `BlogSection` | Bài viết mới nhất |

### Header (`Header/`)

Header chính ~565 dòng code, bao gồm:
- **Mega Search**: Tìm kiếm sản phẩm realtime
- **Navigation**: Menu danh mục
- **Cart Badge**: Số lượng sản phẩm trong giỏ
- **Notification Bell**: Số thông báo chưa đọc + dropdown
- **User Menu**: Avatar, dropdown profile/logout
- **Mobile Responsive**: Hamburger menu

### Chi tiết sản phẩm (`ShopDetails/`)

Component ~1070 dòng code:
- **Image Gallery**: Nhiều ảnh, zoom, preview slider
- **Product Info**: Tên, giá, giảm giá, rating, tồn kho
- **Quantity Selector**: Tăng/giảm số lượng (giới hạn stock)
- **Add to Cart/Wishlist**: Thêm vào giỏ hoặc wishlist
- **Product Tabs**: Mô tả, thông tin bổ sung

### Checkout (`Checkout/`)

| Sub-component | Chức năng |
|---------------|-----------|
| `AddressSection` | Chọn/tạo mới địa chỉ giao hàng |
| `AddressModal` | Modal tạo/sửa địa chỉ |
| `CartSummary` | Tóm tắt giỏ hàng |
| `VoucherSection` | Nhập mã + xem voucher gợi ý |
| `VoucherSuggestionModal` | Modal danh sách voucher hoạt động |
| `PaymentSection` | Chọn phương thức thanh toán |
| `OrderSummary` | Tổng giá + nút đặt hàng |

### My Account (`MyAccount/`)

Dashboard tài khoản với 6 tabs:

| Tab | File | Chức năng |
|-----|------|-----------|
| Dashboard | `Dashboard.tsx` | Tổng quan tài khoản |
| Đơn hàng | `Orders.tsx` | Danh sách đơn, lọc trạng thái, huỷ đơn |
| Địa chỉ | `Addresses.tsx` | CRUD địa chỉ giao hàng |
| Phiên đăng nhập | `Sessions.tsx` | Quản lý phiên, thu hồi từ xa |
| Thông báo | `Notifications.tsx` | Danh sách thông báo, đánh dấu đã đọc |
| Hồ sơ | `Profile.tsx` | Cập nhật thông tin, upload avatar, đổi mật khẩu |

### Shared Components (`Common/`)

| Component | Chức năng |
|-----------|-----------|
| `ProductItem` | Card sản phẩm (dùng chung cho tất cả listings) |
| `QuickViewModal` | Modal xem nhanh sản phẩm |
| `CartSidebar` | Slide-in mini cart từ phải |
| `Pagination` | Phân trang cho danh sách |
| `PreviewSlider` | Image preview fullscreen |
| `Breadcrumb` | Breadcrumb navigation |

---

## 🏪 Redux Store

### Cấu hình Store

```
store = configureStore({
  reducer: {
    quickViewReducer      → QuickView modal state
    cartReducer           → Giỏ hàng (guest + authenticated)
    wishlistReducer       → Danh sách yêu thích (local-only)
    productDetailsReducer → Chi tiết 1 sản phẩm
    productsReducer       → Danh sách sản phẩm + pagination
    categoriesReducer     → Danh mục + pagination
    authReducer           → User, isAuthenticated, loading
    orderReducer          → Đơn hàng + pagination
    shippingAddressReducer→ Địa chỉ giao hàng
    voucherReducer        → Voucher checkout flow
    notificationReducer   → Thông báo realtime
  },
  middleware: [cartListenerMiddleware]
})
```

### Chi tiết 11 Slices

| Slice | State chính | Async Thunks | Sync Reducers |
|-------|-------------|--------------|---------------|
| **authSlice** | `user`, `isAuthenticated`, `loading`, `error` | `login`, `register`, `logout`, `fetchProfile`, `updateProfile`, `changePassword`, `sendVerificationEmail`, `verifyAccount`, `uploadAvatar`, `fetchMySessions`, `revokeMySession` | `clearAuth` |
| **cartSlice** | `cartItems`, `syncing` | `fetchCartFromServer`, `syncGuestCartToServer` | `addItemToCart`, `removeItemFromCart`, `updateCartItemQuantity`, `removeAllItemsFromCart`, `setCartItems` |
| **productsSlice** | `products`, `loading`, `error`, `pagination` | `fetchProducts` | — |
| **productDetailsSlice** | `item`, `loading`, `error` | `fetchProductDetails` | `setProductDetails` |
| **categorySlice** | `categories`, `selectedCategory`, `pagination`, `loading` | `fetchCategories`, `fetchCategoryById` | `clearSelectedCategory` |
| **orderSlice** | `orders`, `currentOrder`, `lastCreatedOrder`, `loading`, `creating`, `cancelling`, `pagination` | `createOrder`, `fetchMyOrders`, `fetchOrderDetails`, `cancelOrder` | `clearCurrentOrder`, `clearLastCreatedOrder`, `clearOrderError` |
| **voucherSlice** | `activeVouchers`, `appliedVoucher`, `voucherCode`, `verifying`, `loadingActive` | `verifyVoucher`, `fetchActiveVouchers` | `setVoucherCode`, `removeAppliedVoucher`, `clearVoucherError`, `resetVoucher` |
| **shippingAddressSlice** | `addresses`, `loading`, `error` | `fetchMyAddresses`, `createAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress` | `clearError` |
| **notificationSlice** | `notifications`, `unreadCount`, `loading`, `pagination` | `fetchNotifications`, `markNotificationAsRead`, `markAllNotificationsAsRead`, `deleteNotification`, `deleteAllReadNotifications` | `addRealtimeNotification`, `clearNotifications` |
| **wishlistSlice** | `wishlistItems` | — (local-only) | `addItemToWishlist`, `removeItemFromWishlist`, `removeAllItemsFromWishlist` |
| **quickViewSlice** | `value` (Product) | — | `updateQuickView`, `resetQuickView` |

### Cart Listener Middleware

Middleware đặc biệt xử lý đồng bộ giỏ hàng:

```
┌─────────────────────────────────────────────────────────────┐
│                  Cart Listener Middleware                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Guest (chưa đăng nhập):                                     │
│  ┌──────────────┐    ┌───────────────┐                       │
│  │ addItemToCart │───→│ localStorage  │  (TTL: 7 ngày)       │
│  │ removeItem   │───→│ (guest_cart)  │                       │
│  │ updateQty    │───→│               │                       │
│  │ removeAll    │───→│               │                       │
│  └──────────────┘    └───────────────┘                       │
│                                                              │
│  Authenticated (đã đăng nhập):                               │
│  ┌──────────────┐    ┌───────────────┐                       │
│  │ addItemToCart │───→│ Cart API      │  (optimistic update)  │
│  │ removeItem   │───→│ (server)      │                       │
│  │ updateQty    │───→│               │                       │
│  │ removeAll    │───→│               │                       │
│  └──────────────┘    └───────────────┘                       │
│                                                              │
│  Login Flow:                                                 │
│  ┌───────────────────┐    ┌───────────────────┐              │
│  │ login.fulfilled    │───→│ syncGuestCart     │              │
│  │ (đọc localStorage │    │ → POST /cart/sync │              │
│  │  + xoá ngay)      │    │ → fetchFromServer │              │
│  └───────────────────┘    └───────────────────┘              │
│                                                              │
│  Page Reload (đã login):                                     │
│  ┌─────────────────────┐    ┌───────────────────┐            │
│  │ fetchProfile.fulfilled│──→│ fetchCartFromServer│           │
│  │ (skip nếu syncing)  │    │ (chỉ khi !syncing) │           │
│  └─────────────────────┘    └───────────────────┘            │
│                                                              │
│  Logout:                                                     │
│  ┌──────────────────┐    ┌───────────────────┐               │
│  │ logout.fulfilled  │───→│ xoá localStorage  │              │
│  └──────────────────┘    │ + xoá Redux state  │              │
│                          └───────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Layer

### Axios Instance

File `axiosInstance.ts` — HTTP client dùng chung:

| Tính năng | Mô tả |
|-----------|-------|
| **Base URL** | `NEXT_PUBLIC_API_URL` (mặc định `http://localhost:8017/V1`) |
| **withCredentials** | `true` — tự động gửi HttpOnly cookies |
| **Timeout** | 30 giây |
| **Auto Refresh Token** | Khi nhận HTTP 410 → gọi `/users/refresh-token` → retry request gốc |
| **Queue Requests** | Nhiều request 410 cùng lúc → chỉ gọi refresh 1 lần, queue lại |
| **Auto Logout** | HTTP 401 → dispatch `clearAuth()` + gọi logout API + redirect `/signin` |
| **Inject Store** | Pattern tránh circular dependency: `injectStore(store)` từ `store.ts` |
| **Toast Errors** | Hiển thị lỗi server tự động qua `react-hot-toast` |

### API Endpoints

Toàn bộ endpoints được định nghĩa dạng constant object:

```typescript
API_ENDPOINTS = {
  PRODUCTS: {
    ALL:     'GET /products/getAll'        // ?page, search, category, minPrice, maxPrice, rating, sort
    DETAILS: 'GET /products/details/:id'
  },
  CATEGORIES: {
    ALL:     'GET /categories'             // ?page, search
    DETAILS: 'GET /categories/:id'
  },
  AUTH: {
    REGISTER:                'POST /users/register'
    LOGIN:                   'POST /users/login'
    LOGOUT:                  'POST /users/logout'
    REFRESH_TOKEN:           'POST /users/refresh-token'
    SEND_VERIFICATION_EMAIL: 'POST /users/send-verification-email'
    VERIFY_ACCOUNT:          'GET  /users/verify-account'
    GOOGLE:                  'GET  /users/auth/google'
    GOOGLE_CALLBACK:         'GET  /users/auth/google/callback'
    FACEBOOK:                'GET  /users/auth/facebook'
    FACEBOOK_CALLBACK:       'GET  /users/auth/facebook/callback'
  },
  USER: {
    PROFILE:         'GET/PUT  /users/me'
    CHANGE_PASSWORD: 'PUT      /users/me/password'
    UPLOAD_AVATAR:   'POST     /users/upload-avatar'
    MY_SESSIONS:     'GET      /users/my-sessions'
    REVOKE_SESSION:  'POST     /users/revoke-my-session'
  },
  ORDERS: {
    CREATE:    'POST /orders/create'
    MY_ORDERS: 'GET  /orders/my-orders'    // ?page, status
    DETAILS:   'GET  /orders/details/:id'
    CANCEL:    'POST /orders/cancel/:id'
  },
  VOUCHERS: {
    VERIFY: 'POST /vouchers/verify'        // Public
    ACTIVE: 'GET  /vouchers/active'        // Public, ?limit
  },
  CART: {
    GET:    'GET    /cart'
    ADD:    'POST   /cart/add'
    UPDATE: 'PUT    /cart/update'
    REMOVE: 'DELETE /cart/remove/:productId'
    SYNC:   'POST   /cart/sync'
    CLEAR:  'DELETE /cart/clear'
  },
  NOTIFICATIONS: {
    LIST:        'GET    /notifications'           // ?page, isRead
    MARK_READ:   'PATCH  /notifications/:id/read'
    MARK_ALL:    'PATCH  /notifications/read-all'
    DELETE:      'DELETE /notifications/:id'
    DELETE_READ: 'DELETE /notifications/delete-read'
  },
  SHIPPING_ADDRESSES: {
    LIST:        'GET    /shipping-addresses'
    CREATE:      'POST   /shipping-addresses'
    UPDATE:      'PUT    /shipping-addresses/:id'
    DELETE:      'DELETE /shipping-addresses/:id'
    SET_DEFAULT: 'PATCH  /shipping-addresses/:id/default'
  }
}
```

---

## 📦 Services

Mỗi service module tương ứng với một domain, gọi API thông qua `axiosInstance`:

| Service | Methods | Mô tả |
|---------|---------|-------|
| **authService** | `login`, `register`, `logout`, `refreshToken`, `sendVerificationEmail`, `verifyAccount` | Xác thực người dùng |
| **productService** | `getAll`, `getById`, `getAllCategories`, `getCategoryById` | Sản phẩm & danh mục |
| **cartService** | `getCart`, `addToCart`, `updateCart`, `removeFromCart`, `syncCart`, `clearCart` | Giỏ hàng server-side |
| **orderService** | `createOrder`, `getMyOrders`, `getOrderDetails`, `cancelOrder` | Quản lý đơn hàng |
| **voucherService** | `verifyVoucher`, `getActiveVouchers` | Voucher & giảm giá (public) |
| **userService** | `getProfile`, `updateProfile`, `changePassword`, `uploadAvatar`, `getMySessions`, `revokeSession` | Hồ sơ & phiên |
| **shippingAddressService** | `getMyAddresses`, `createAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress` | Địa chỉ giao hàng |
| **notificationService** | `getMyNotifications`, `markAsRead`, `markAllAsRead`, `deleteNotification`, `deleteAllRead` | Thông báo |

---

## ⚡ Socket.IO Realtime

### Kiến trúc

```
┌─────────────┐     WebSocket      ┌──────────────┐
│  Client      │◄──────────────────►│  Backend     │
│  (Browser)   │   socket.io-client │  Socket.IO   │
│              │                    │  Server      │
│  SocketProvider                   │              │
│  ├── auto-connect khi login      │  Rooms:      │
│  ├── auto-disconnect khi logout  │  ├── user:{id}│
│  ├── refresh token trước connect │  └── admin    │
│  └── retry 3 lần khi lỗi        │              │
└─────────────┘                    └──────────────┘
```

### Socket Events (Client nhận)

| Event | Payload | Xử lý |
|-------|---------|-------|
| `ORDER_STATUS_UPDATED` | `{ orderId, oldStatus, newStatus, updatedAt }` | `fetchMyOrders()` — refresh danh sách đơn |
| `ORDER_PAYMENT_UPDATED` | `{ orderId, paymentStatus, updatedAt }` | `fetchMyOrders()` — refresh danh sách đơn |
| `ORDER_CANCELLED` | `{ orderId, reason, cancelledAt }` | `fetchMyOrders()` — refresh danh sách đơn |
| `ORDER_MARK_PAID` | `{ orderId, paidAt }` | `fetchMyOrders()` — refresh danh sách đơn |
| `NOTIFICATION_NEW` | `{ id, type, message, createdAt }` | Toast 🔔 + `addRealtimeNotification()` vào Redux |

### Kết nối & Token

1. **Connect**: Gọi `/users/refresh-token` → lấy `accessToken` mới → truyền qua `auth.token` trong handshake
2. **TOKEN_EXPIRED**: Backend trả lỗi → client refresh token → retry connect (tối đa 3 lần)
3. **Disconnect**: Server ngắt hoặc transport close → auto reconnect sau 2s
4. **Logout**: Ngắt socket + xoá notification state

---

## 🔐 Xác thực & Phân quyền

### Flow xác thực

```
┌─────────────┐    POST /users/login     ┌──────────────┐
│  Client      │────────────────────────→│  Backend     │
│              │◄────────────────────────│              │
│              │  Set-Cookie: accessToken │              │
│              │  Set-Cookie: refreshToken│              │
│              │  + { user, sessionId }   │              │
└─────────────┘                          └──────────────┘

HttpOnly Cookies (tự động gửi với withCredentials: true)
├── accessToken  → Hết hạn ngắn → HTTP 410 → auto refresh
└── refreshToken → Hết hạn dài  → HTTP 401 → auto logout
```

### OAuth Flow

```
Client                          Backend                    Google/Facebook
  │                                │                            │
  │  redirect → /auth/google       │                            │
  │───────────────────────────────→│  redirect → OAuth provider │
  │                                │───────────────────────────→│
  │                                │◄───────────────────────────│
  │                                │  callback + set cookies    │
  │◄───────────────────────────────│                            │
  │  /oauth-success (set auth state)                            │
  │  /oauth-failure (show error)                                │
```

### Xác minh Email

1. **Đăng ký** → Server gửi email xác thực
2. **`/verify-account?email=...&token=...`** → Xác minh token
3. **`/resend-verification`** → Gửi lại email xác thực
4. **`/mail-success`** → Hiển thị thông báo gửi thành công

### Auto Auth (Page Reload)

```
App mount → fetchProfile()
  ├── Success → isAuthenticated = true, load cart từ server
  └── Failure → isAuthenticated = false, dùng guest cart từ localStorage
```

---

## 🛒 Giỏ hàng & Checkout

### Giỏ hàng thông minh

| Trạng thái | Lưu trữ | Sync |
|------------|---------|------|
| **Guest** (chưa login) | `localStorage` key `guest_cart` (TTL 7 ngày) | — |
| **Authenticated** (đã login) | Server (Cart API) | Optimistic update: Redux trước → API sau |
| **Login** | `localStorage` → `POST /cart/sync` → xoá localStorage → `GET /cart` | Auto merge |
| **Logout** | Xoá localStorage + Redux state | — |

### Checkout Flow

```
1. Giỏ hàng (/cart)
   └── Xem sản phẩm, cập nhật số lượng, xoá

2. Checkout (/checkout)  [Yêu cầu đăng nhập]
   ├── Chọn/Tạo địa chỉ giao hàng
   ├── Nhập mã voucher hoặc chọn từ gợi ý
   ├── Chọn phương thức thanh toán (COD / Banking)
   └── Xác nhận đặt hàng → POST /orders/create

3. Thành công (/checkout-success)
   └── Hiển thị thông tin đơn hàng vừa tạo

4. Theo dõi (/my-account → tab Đơn hàng)
   ├── Lọc theo trạng thái
   ├── Xem chi tiết
   └── Huỷ đơn (nếu cho phép)
```

---

## ⚙️ Biến môi trường

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

| Biến | Bắt buộc | Mặc định | Mô tả |
|------|---------|-----------|-------|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:8017/V1` | URL Backend API (bao gồm version path) |
| `NEXT_PUBLIC_SITE_URL` | — | `http://localhost:3000` | URL website client (redirects, meta tags) |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | — | `false` | Bật/tắt analytics tracking |
| `NEXT_PUBLIC_ENABLE_PWA` | — | `false` | Bật/tắt PWA features |
| `NEXT_PUBLIC_GA_ID` | — | — | Google Analytics ID |
| `NEXT_PUBLIC_FB_PIXEL_ID` | — | — | Facebook Pixel ID |

### Next.js Config

Cấu hình `next.config.js` cho phép tải ảnh từ các nguồn bên ngoài:

- `res.cloudinary.com` — Product images (Cloudinary CDN)
- `lh3.googleusercontent.com` — Google OAuth avatars
- `**.fbcdn.net` — Facebook OAuth avatars

---

## 🚀 Cài đặt & Chạy

### Yêu cầu

- **Node.js** >= 18.x
- **pnpm** >= 8.x (khuyến nghị)
- Backend API đang chạy ([Commerce-Api](../Commerce-Api/))

### Cài đặt

```bash
# Clone & di chuyển vào thư mục
cd clientEC

# Cài đặt dependencies
pnpm install

# Tạo file môi trường
cp .env.example .env.local
# Chỉnh sửa .env.local theo môi trường của bạn
```

### Chạy Development

```bash
pnpm dev
```

Mở trình duyệt tại `http://localhost:3000`

### Build Production

```bash
pnpm build
pnpm start
```

---

## 📜 Scripts

| Script | Lệnh | Mô tả |
|--------|-------|-------|
| `dev` | `pnpm dev` | Chạy development server (Turbopack) |
| `build` | `pnpm build` | Build production |
| `start` | `pnpm start` | Chạy production server |
| `lint` | `pnpm lint` | Kiểm tra linting |

---

## 📚 Tài liệu

| File | Nội dung |
|------|----------|
| `docs/CLIENT_API_DOCUMENTATION.md` | Tài liệu API client tổng quan |
| `docs/client_api_full_doc.md` | Tài liệu API đầy đủ chi tiết |
| `docs/CLIENT_AUTH_API_DOCUMENTATION.md` | API xác thực (login, register, OAuth) |
| `docs/client_catalog_api_doc.md` | API sản phẩm & danh mục |
| `docs/client_user_api_doc.md` | API quản lý user |
| `docs/commit-message-instruction.md` | Quy tắc commit message |
| `docs/pull_request_template.md` | Template pull request |

---

## 🔗 Liên kết dự án

| Dự án | Mô tả |
|-------|-------|
| [Commerce-Api](../Commerce-Api/) | Backend API (Express.js + Prisma + PostgreSQL) |
| [AdminDashboard](../AdminDashboard/) | Admin Dashboard (Next.js + MUI) |
| **clientEC** (hiện tại) | Client E-Commerce Frontend |
