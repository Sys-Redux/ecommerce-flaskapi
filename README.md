# E-commerce Flask API

A REST API for an e-commerce backend built with Flask, SQLAlchemy, and MySQL. This project handles users, products, and orders with proper authentication, validation, and database relationships.

## Overview

I built this API to practice real-world Flask development patterns including JWT authentication, many-to-many relationships, pagination, and input validation. It's designed to feel closer to what you'd actually use in production rather than just a basic CRUD app.

## Features

- 🔐 User registration and login with JWT tokens
- 🛡️ Secure authentication on protected routes
- 📦 Full CRUD operations for users, products, and orders
- 🔗 Many-to-many relationships between orders and products
- 📄 Pagination for large datasets
- ✅ Input validation using Marshmallow schemas
- 🔒 Password hashing with Werkzeug

## Tech Stack

- **Backend Framework**: Flask
- **Database**: MySQL
- **ORM**: SQLAlchemy 2.0 (with modern typed syntax)
- **Validation**: Marshmallow + Flask-Marshmallow
- **Authentication**: Flask-JWT-Extended
- **Security**: Werkzeug password hashing
- **Testing**: Postman

## Database Schema

### Users
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `address` - User's address
- `password` - Hashed password

### Products
- `id` - Primary key
- `product_name` - Name of the product
- `price` - Product price

### Orders
- `id` - Primary key
- `user_id` - Foreign key to Users
- `order_date` - Timestamp of order creation

### Order_Product (Association Table)
- `order_id` - Foreign key to Orders
- `product_id` - Foreign key to Products
- Composite primary key prevents duplicate product entries in the same order

## Setup Instructions

### Prerequisites
- Python 3.x installed
- MySQL server running locally
- A database created (e.g., `ecommerce_flaskapi`)

### Installation

1. **Clone this repository**
   ```bash
   git clone https://github.com/Sys-Redux/ecommerce-flaskapi.git
   cd ecommerce-flaskapi
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure the database**

   Update the database connection string in `app.py`:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://username:password@localhost/ecommerce_flaskapi'
   ```

   > **Note**: If your password contains special characters like `?`, you'll need to URL-encode it.

4. **Run the application**
   ```bash
   flask run
   ```
   or
   ```bash
   python app.py
   ```

5. **Access the API**

   The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Create a new user account | No |
| POST | `/login` | Login and receive JWT access token | No |
| GET | `/users/me` | Get current user info | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users (supports pagination) | No |
| GET | `/users/<id>` | Get user by ID | No |
| PUT | `/users/<id>` | Update user (partial updates supported) | Yes (own account) |
| DELETE | `/users/<id>` | Delete user | Yes (own account) |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products (`?page=1&per_page=10`) | No |
| POST | `/products` | Create a new product | No |
| GET | `/products/<id>` | Get product by ID | No |
| PUT | `/products/<id>` | Update product (partial updates supported) | No |
| DELETE | `/products/<id>` | Delete product | No |
| DELETE | `/products/delete_multiple` | Delete multiple products | No |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create new order with multiple products | No |
| GET | `/orders` | Get all orders (supports pagination) | No |
| GET | `/orders/<id>` | Get order by ID | No |
| PUT | `/orders/<id>` | Update order (user or products) | No |
| GET | `/orders/filter` | Filter orders by date range | No |

## Example Requests

### Register a New User

```bash
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "address": "123 Main St"
}
```

### Login

```bash
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": 1,
  "name": "John Doe"
}
```

### Create an Order

```bash
POST /orders
Content-Type: application/json

{
  "user_id": 1,
  "product_ids": [1, 2, 3]
}
```

### Using Protected Routes

Include the JWT token in your request headers:

```bash
GET /users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Pagination Example

```bash
GET /products?page=2&per_page=20
```

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "page": 2,
    "per_page": 20,
    "total_pages": 5,
    "total_items": 97,
    "has_next": true,
    "has_prev": true,
    "next_page": 3,
    "prev_page": 1
  }
}
```

## Key Implementation Details

### JWT Authentication
I implemented JWT-based authentication where users log in and receive a token. Protected routes require this token in the Authorization header.

**Important**: The JWT subject must be a string, so I convert the user ID to a string when creating tokens and back to an integer when querying the database.

### Many-to-Many Relationships
Orders can have multiple products and products can be in multiple orders. I used an association table (`order_product`) with a composite primary key to prevent accidentally adding the same product twice to an order.

### Pagination
For endpoints that return lists (like products or orders), I added pagination support. The response includes both the data and pagination metadata (current page, total pages, has next/previous, etc.).

### Partial Updates
I implemented partial updates using Marshmallow's `partial=True` parameter. This means you can update just one field (like a user's name) without having to send all the other fields.

### Input Validation
Using Marshmallow schemas, all incoming data is validated before hitting the database. If validation fails, the API returns a 400 error with details about what went wrong.

## What I Learned

### SQLAlchemy 2.0 Syntax
I used the new SQLAlchemy 2.0 style with `DeclarativeBase`, `Mapped` type hints, and `mapped_column`. It makes the code cleaner and gives better IDE support.

### Database Constraints
Instead of just relying on application logic, I enforced constraints at the database level—like unique email addresses and composite primary keys. This prevents data integrity issues even if something bypasses the application layer.

### Marshmallow Patterns
- `include_fk=True` to expose foreign keys in schemas
- `unknown=EXCLUDE` to ignore extra fields in requests (like `product_ids` that aren't actual model fields)
- `partial=True` for flexible updates

### JWT Best Practices
The subject in JWT tokens must be a string, not an integer. Also, proper authorization checks are important—users should only be able to update/delete their own accounts.

### MySQL Connection Issues
If your database password contains special characters, you need to URL-encode the connection string. Otherwise you'll get authentication errors that are confusing to debug.

### Error Handling
I made sure to return proper HTTP status codes:
- `200` - Success
- `201` - Resource created
- `400` - Bad request/validation errors
- `401` - Authentication required
- `403` - Forbidden (authenticated but not authorized)
- `404` - Resource not found
- `500` - Server errors

## Testing with Postman

1. Import the `APIs.postman_collection.json` file (if available)
2. Register a new user via `/register`
3. Login via `/login` and copy the access token
4. For protected routes, add the token to the Authorization header:
   - Type: Bearer Token
   - Token: `<paste_your_token_here>`

## Future Improvements

- [ ] Add database migrations with Alembic
- [ ] Implement role-based access control (admin vs regular users)
- [ ] Add quantity field to order_product table for proper cart functionality
- [ ] Write unit and integration tests with pytest
- [ ] Add Docker configuration for easier deployment
- [ ] Implement rate limiting
- [ ] Add better logging and monitoring
- [ ] Create API documentation with Swagger/OpenAPI

## Project Structure

```
ecommerce-flaskapi/
├── app.py                          # Main application file
├── requirements.txt                # Python dependencies
├── APIs.postman_collection.json    # Postman collection for testing
└── README.md                       # This file
```

## Why I Built This

I wanted to build something more realistic than a basic tutorial project. This API includes the kinds of patterns you'd actually use in production: proper authentication, database relationships, validation, pagination, and security best practices. It gave me hands-on experience with modern Flask and SQLAlchemy patterns that I can take into real-world projects.

## License

This project is open source and available for educational purposes.

## Contact

- **GitHub**: [Sys-Redux](https://github.com/Sys-Redux)
- **Repository**: [ecommerce-flaskapi](https://github.com/Sys-Redux/ecommerce-flaskapi)
