# 🚀 Product Importer

[![Python](https://img.shields.io/badge/python-3.13-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.123.10-brightgreen)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Backend](https://img.shields.io/badge/Backend-Render-blue)](https://product-importer-f55p.onrender.com)
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-purple)](https://product-importer-eight.vercel.app)

A **FastAPI backend** for managing products with CRUD, bulk CSV upload, and real-time updates via WebSockets. Integrated with a modern frontend deployed on Vercel.

---

## 🌐 Live URLs

| Environment | URL |
|------------|-----|
| **Backend** | [https://product-importer-f55p.onrender.com](https://product-importer-f55p.onrender.com) |
| **Frontend** | [https://product-importer-eight.vercel.app](https://product-importer-eight.vercel.app) |

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/` | Check if server is running |
| GET    | `/products` | Fetch paginated and filtered product list |
| POST   | `/products` | Create a single product |
| POST   | `/products/bulk-upload-csv` | Upload multiple products via CSV |
| PUT    | `/products/{product_id}` | Update product details |
| DELETE | `/products/{product_id}` | Delete a single product |
| DELETE | `/products/bulk` | Delete all products |
| WS     | `/ws/{client_id}` | WebSocket connection for real-time updates |

---

## ⚙️ Setup (Local Development)

1. **Clone the repository**
```bash
git clone https://github.com/Akarsh63/Product-Importer.git
cd Product-Importer
