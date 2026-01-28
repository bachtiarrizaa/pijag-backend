# ☕ Pijag Coffee API

## 📌 Introduction

**Pijag Coffee API** adalah backend application untuk sistem **Coffee Shop Management** yang mencakup **POS (Point of Sale)**, **Customer Ordering**, **Authentication**, serta **Payment & Transaction Management**.

Aplikasi ini dirancang untuk mendukung operasional coffee shop secara end‑to‑end, mulai dari pengelolaan produk, pesanan customer, kasir, hingga pencatatan transaksi dan laporan keuangan.

Backend ini dibangun menggunakan **Node.js + Express + TypeScript** dengan **Prisma ORM** dan database **MySQL**.

---

## 🧱 Tech Stack

* **Node.js**
* **Express.js**
* **TypeScript**
* **Prisma ORM**
* **MySQL**
* **JWT Authentication**
<!-- * **Swagger (API Documentation)** -->

---

## 🗄️ Database Overview

Database menggunakan **MySQL** dengan Prisma sebagai ORM. Struktur database mendukung relasi kompleks untuk sistem coffee shop.

### 🔐 Authentication & User

* `User`
* `Role`
* `Customer`
* `BlacklistToken`

### 📦 Product & Catalog

* `Category`
* `Product`
* `ProductDiscount`
* `Discount`
* `Voucher`

### 🛒 Cart & Wishlist

* `Cart`
* `CartItem`
* `Wishlist`

### 🧾 Order & Payment

* `Order`
* `OrderItem`
* `Payment`
* `Transaction`

### 🧑‍💼 POS & Cashier

* `Shift`

### ⭐ Review

* `Review`

Database menggunakan enum untuk menjaga konsistensi status seperti `OrderStatus`, `PaymentStatus`, `ShiftStatus`, dan lain‑lain.

---

## 🚀 Application Features

### 🔐 Authentication & Authorization

* Register & login user
* JWT access token
* Logout dengan token blacklist
* Role-based access control

### 👥 User & Customer Management

* Multi-role user (Admin, Cashier, Customer)
* Customer profile & loyalty points

### 📦 Product & Category Management

* CRUD kategori produk
* CRUD produk
* Stock management
* Upload gambar produk

### 🎯 Discount & Voucher System

* Diskon produk (percent / fixed)
* Voucher dengan minimum order
* Periode aktif voucher

### 🛒 Cart & Wishlist

* Customer cart system
* Update quantity & subtotal otomatis
* Wishlist produk

### 🧾 Order Management

* Order dari customer & cashier
* Order status lifecycle
* Voucher application

### 💳 Payment System

* Multiple payment method (cash, card, e-wallet)
* Payment status tracking
* Split payment support

### 🧑‍💼 POS & Shift Management

* Open & close cashier shift
* Cash tracking (start & end)
* Transaction logging

### ⭐ Review & Rating

* Customer product review
* Rating system

---

## 📁 Project Structure

```bash
src/
├── config/        # App config
├── controllers/   # Request handlers
├── middleware/    # Auth & error middleware
├── repositories/  # Database access layer
├── routes/        # API routes
├── services/      # Business logic
├── types/         # TypeScript interfaces
├── utils/         # Helper & utility functions
└── app.ts         # Express app entry
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/pijag-coffee-api.git
cd pijag-coffee-api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Configuration

Buat file `.env` di root project:

```bash
cp .env.example .env
```

### 4️⃣ Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Migrasi database:

```bash
npx prisma migrate dev
```

(Optional) Seed data:

```bash
npx prisma db seed
```

---

## ▶️ Run Application

### Development Mode

```bash
npm run dev
```

Server akan berjalan di:

```text
http://localhost:3000
```

---

## 📘 API Documentation

<!-- Swagger UI tersedia di: -->

```text
<!-- http://localhost:3000/api-docs -->
```

Digunakan untuk:

* Testing API
* Melihat request & response
* Authorization testing (Bearer Token)

---

## 🔒 Authentication Flow

1. User login → mendapatkan JWT token
2. Token dikirim via header:

```http
Authorization: Bearer <token>
```

3. Token divalidasi oleh middleware
4. Logout akan blacklist token

---

## 👨‍💻 Author

Developed by **bachtiarrizaa**

---

## 📄 License

<!-- This project is licensed under the MIT License. -->
