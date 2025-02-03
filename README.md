# Ecommerce API Documentation

## Overview
This is a backend API for an Ecommerce platform built using Node.js, Express, and MongoDB. It supports user authentication, product management, reviews, orders, and security measures.

## Features
- User authentication (Register, Login, Logout, Password Reset)
- User roles (Admin, Customer)
- Product CRUD operations
- Product reviews
- Order management
- Security features (Helmet, CORS, Rate Limiting, XSS Protection, Mongo Sanitize)

## Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JWT Authentication**
- **Express Middleware**

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manlikeAnthony/E_COMMERCE_API
   ```
2. Navigate into the project folder:
   ```bash
   cd E_COMMERCE_API
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_LIFETIME=1d
   ```
5. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication Routes
| Method | Endpoint           | Description          |
|--------|-------------------|----------------------|
| POST   | `/api/v1/auth/register` | Register a new user |
| POST   | `/api/v1/auth/login`    | Login user         |
| GET    | `/api/v1/auth/logout`   | Logout user        |

### User Routes
| Method | Endpoint         | Description        |
|--------|----------------|--------------------|
| GET    | `/api/v1/users` | Get all users     |
| GET    | `/api/v1/users/:id` | Get single user |
| PATCH  | `/api/v1/users/:id` | Update user    |

### Product Routes
| Method | Endpoint          | Description      |
|--------|------------------|------------------|
| POST   | `/api/v1/products` | Create product |
| GET    | `/api/v1/products` | Get all products |
| GET    | `/api/v1/products/:id` | Get single product |
| PATCH  | `/api/v1/products/:id` | Update product |
| DELETE | `/api/v1/products/:id` | Delete product |

### Review Routes
| Method | Endpoint           | Description          |
|--------|-------------------|----------------------|
| POST   | `/api/v1/reviews` | Add a review        |
| GET    | `/api/v1/reviews` | Get all reviews     |
| GET    | `/api/v1/reviews/:id` | Get single review |
| PATCH  | `/api/v1/reviews/:id` | Update Review    |
| DELETE  | `/api/v1/reviews/:id` | Update Review    |


### Order Routes
| Method | Endpoint           | Description      |
|--------|-------------------|------------------|
| POST   | `/api/v1/orders`  | Place an order   |
| GET    | `/api/v1/orders`  | Get all orders   |
| GET    | `/api/v1/orders/:id` | Get single order |
| PATCH  | `/api/v1/orders/:id` | Update Order    |

## Middleware & Security
- **Helmet**: Security headers
- **CORS**: Cross-Origin Resource Sharing
- **Rate Limiting**: Limits API requests per minute
- **XSS Clean**: Prevents XSS attacks
- **Mongo Sanitize**: Prevents NoSQL Injection

## Running Tests
To run tests:
```bash
npm test
```

## Deployment
You can deploy this API using cloud platforms like:
- **Heroku**
- **Vercel**
- **Render**

## License
This project is licensed under the MIT License.

## Author
Developed by **Anthony** 🚀
try it out and let me know what you think 


