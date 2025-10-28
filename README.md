# 🧸 Quản lý & Chia sẻ Đồ Chơi Trẻ Em

Website giúp người dùng quản lý và chia sẻ đồ chơi trẻ em với cộng đồng.

## 🎯 Tính năng

### 🔐 **Authentication & Authorization**
- ✅ **Đăng nhập/Đăng ký**: Hệ thống xác thực người dùng
- ✅ **3 vai trò người dùng**:
  - 👑 **Admin**: Quản lý toàn bộ hệ thống
  - 👔 **Employee**: Quản lý đồ chơi và xử lý yêu cầu mượn
  - 👤 **Customer**: Mượn và chia sẻ đồ chơi

### 👑 **Admin Dashboard**
- 📊 Xem tổng quan hệ thống (users, toys, borrows)
- 👥 Quản lý người dùng (xem danh sách, phân quyền)
- 🧸 Quản lý tất cả đồ chơi
- 📦 Theo dõi tất cả giao dịch mượn trả

### 👔 **Employee Dashboard**
- 📊 Xem thống kê đồ chơi và giao dịch
- 🧸 Quản lý kho đồ chơi
- ✅ Duyệt/Từ chối yêu cầu mượn
- 📦 Xác nhận trả đồ chơi

### 👤 **Customer Features**
- ✅ **Quản lý đồ chơi của tôi**:
  - Thêm đồ chơi mới với thông tin chi tiết
  - Chỉnh sửa thông tin đồ chơi
  - Xóa đồ chơi khỏi danh sách
  - Theo dõi trạng thái (có sẵn/đang cho mượn)

- ✅ **Tìm & Mượn đồ chơi**:
  - Duyệt đồ chơi có sẵn từ người dùng khác
  - Tìm kiếm theo tên/mô tả
  - Lọc theo danh mục
  - Gửi yêu cầu mượn với ngày trả dự kiến

- ✅ **Quản lý mượn trả**:
  - Xem đồ đang mượn
  - Đánh dấu đã trả đồ chơi
  - Xem yêu cầu mượn đồ của bạn
  - Chấp nhận/Từ chối yêu cầu

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: npm

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Node.js 18+ 
- npm hoặc yarn

### Các bước cài đặt

1. **Cài đặt dependencies** (nếu chưa cài):
```bash
npm install
```

2. **Chạy development server**:
```bash
npm run dev
```

3. **Mở trình duyệt**:
Truy cập [http://localhost:3000](http://localhost:3000)

## 👥 Tài khoản Demo

### 👑 Admin
- **Email**: admin@toymanagement.com
- **Password**: admin123
- **Quyền**: Quản lý toàn bộ hệ thống

### 👔 Employee
- **Email**: employee@toymanagement.com
- **Password**: employee123
- **Quyền**: Quản lý đồ chơi và giao dịch

### 👤 Customer
- **Email**: user1@example.com
- **Password**: user123
- **Quyền**: Mượn và chia sẻ đồ chơi

## 📁 Cấu trúc dự án

```
toy-management/
├── app/
│   ├── page.tsx                    # Trang chủ
│   ├── login/page.tsx              # Đăng nhập
│   ├── register/page.tsx           # Đăng ký
│   ├── admin/dashboard/page.tsx    # Admin dashboard
│   ├── employee/dashboard/page.tsx # Employee dashboard
│   ├── my-toys/page.tsx           # Đồ chơi của tôi (Customer)
│   ├── browse/page.tsx            # Tìm đồ chơi (Customer)
│   ├── borrows/page.tsx           # Quản lý mượn (Customer)
│   └── layout.tsx                 # Root layout
├── components/
│   ├── Navbar.tsx                 # Navigation với auth
│   ├── ToyCard.tsx
│   ├── ToyFormModal.tsx
│   └── BorrowModal.tsx
├── lib/
│   ├── auth.ts                    # Authentication logic
│   └── store.ts                   # Data management
└── types/
    └── index.ts                   # TypeScript interfaces
```

## 🎨 Flow người dùng

### Customer Flow:
1. Đăng ký/Đăng nhập
2. Thêm đồ chơi của mình
3. Tìm đồ chơi muốn mượn
4. Gửi yêu cầu mượn
5. Chờ chủ sở hữu chấp nhận
6. Trả đồ chơi sau khi sử dụng

### Owner (Customer có đồ cho mượn):
1. Nhận yêu cầu mượn
2. Chấp nhận/Từ chối yêu cầu
3. Theo dõi đồ đang cho mượn
4. Xác nhận khi được trả lại

### Employee Flow:
1. Đăng nhập với tài khoản employee
2. Xem tổng quan hệ thống
3. Duyệt yêu cầu mượn
4. Xác nhận trả đồ chơi
5. Quản lý kho đồ chơi

### Admin Flow:
1. Đăng nhập với tài khoản admin
2. Xem dashboard tổng quan
3. Quản lý người dùng
4. Theo dõi tất cả đồ chơi
5. Giám sát giao dịch

## 💾 Quản lý dữ liệu

Hiện tại dự án sử dụng **mock data** trong memory (`lib/auth.ts` và `lib/store.ts`). 

Để triển khai thực tế, có thể tích hợp:
- Database: PostgreSQL/MongoDB/Supabase/Firebase
- Authentication: NextAuth.js/Clerk/Auth0
- Image Upload: Cloudinary/AWS S3/Vercel Blob

## 🔐 Security Notes

**⚠️ Lưu ý**: Đây là demo project với mock authentication. Trong production:
- Sử dụng thư viện authentication chuyên nghiệp
- Hash passwords (bcrypt, argon2)
- Sử dụng JWT tokens hoặc sessions
- Implement HTTPS
- Add CSRF protection
- Rate limiting cho login attempts

## 🎯 Tính năng có thể mở rộng

- [ ] Real database integration
- [ ] Email notifications
- [ ] Upload hình ảnh thực tế
- [ ] Chat giữa người dùng
- [ ] Đánh giá và review
- [ ] Maps tìm đồ chơi gần bạn
- [ ] Payment integration
- [ ] Analytics dashboard

## 📱 Responsive Design

Website responsive hoạt động tốt trên Mobile, Tablet, Desktop.

---

Made with ❤️ using Next.js, React, and Tailwind CSS
