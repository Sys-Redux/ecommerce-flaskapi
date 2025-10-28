# Setting up a flask app with MySQL connection
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow import ValidationError, fields
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Table, String, Column, DateTime, func, select
from typing import List
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)

# Configure CORS to allow frontend communication
# In production, this will be https://vampware.com
# In development, this allows localhost
allowed_origins = os.environ.get('CORS_ORIGINS', 'https://vampware.com','https://www.vampware.com').split(',')
CORS(app, resources={r"/*": {"origins": allowed_origins}})

# MySQL DB Connection - Use environment variable in production
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'SQLALCHEMY_DATABASE_URI',
    'mysql+mysqlconnector://root:virginia17Javascript#data@localhost/ecommerce_flaskapi'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Config - Use environment variable in production
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'donaldRumpe')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False

# Base Model
class Base(DeclarativeBase):
    pass

# Initialize SQLAlchemy and Marshmallow
db = SQLAlchemy(model_class=Base)
db.init_app(app)
ma = Marshmallow(app)
jwt = JWTManager(app)

with app.create_context():
    db.create_all()

# ------------------------- Models ---------------------------------
# Association Table for Many-to-Many relationship between Orders and Products
# Include composite primary key to avoid duplicate entries
order_product = Table(
    'order_product',
    Base.metadata,
    Column('order_id', ForeignKey('orders.id'), primary_key=True),
    Column('product_id', ForeignKey('products.id'), primary_key=True)
)

class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    address: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)

    # One-to-Many relationship with Orders
    orders: Mapped[List['Order']] = relationship('Order', back_populates='user')

class Order(Base):
    __tablename__ = 'orders'
    id: Mapped[int] = mapped_column(primary_key=True)
    order_date: Mapped[DateTime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)

    # Many-to-One relationship with User
    user: Mapped['User'] = relationship('User', back_populates='orders')
    # Many-to-Many relationship with Products
    products: Mapped[List['Product']] = relationship(secondary=order_product, back_populates='orders')

class Product(Base):
    __tablename__ = 'products'
    id: Mapped[int] = mapped_column(primary_key=True)
    product_name: Mapped[str] = mapped_column(String(100))
    price: Mapped[float] = mapped_column(nullable=False)

    # Many-to-Many relationship with Orders
    orders: Mapped[List['Order']] = relationship(secondary=order_product, back_populates='products')


# ------------------------- Schemas ---------------------------------
# Defining Marshmallow Schemas for serialization/deserialization
class UserSchema(ma.SQLAlchemyAutoSchema):
    password = fields.String(load_only=True, required=True)

    class Meta:
        model = User

class OrderSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Order
        include_fk = True
        unknown = 'EXCLUDE'  # Ignore unknown fields like product_ids

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product

# Create instances of the schemas
user_schema = UserSchema()
users_schema = UserSchema(many=True)
order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)


# ------------------------- Routes ---------------------------------

# ----- User Endpoints -----

# Retrieve all users
@app.route('/users', methods=['GET'])
def get_users():
    query = select(User)
    users = db.session.execute(query).scalars().all()
    return users_schema.jsonify(users), 200

# Retrieve a user by ID
@app.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    user = db.session.get(User, id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return user_schema.jsonify(user), 200

# Register a new user with hashed password
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json

        # Check if user already exists
        existing_user = db.session.execute(
            select(User).where(User.email == data.get('email'))
        ).scalar_one_or_none()

        if existing_user:
            return jsonify({'message': 'User already exists'}), 400

        # Hash the password
        hashed_password = generate_password_hash(data['password'])

        new_user = User(
            name=data['name'],
            address=data.get('address', ''),
            email=data['email'],
            password=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully', 'user_id': new_user.id}), 201

    except KeyError as e:
        return jsonify({'message': f'Missing field: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500

# Login user
@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid email or password'}), 401

    # Create access token
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'access_token': access_token,
        'user_id': user.id,
        'name': user.name
    }), 200

# Get current user profile
@app.route('/users/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    # Convert user_id back to int
    user = db.session.get(User, int(current_user_id))

    if not user:
        return jsonify({'message': 'User not found'}), 404

    return user_schema.jsonify(user), 200

# Update an existing user by ID
@app.route('/users/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    current_user_id = int(get_jwt_identity())

    # Users can only update their own profile
    if current_user_id != id:
        return jsonify({'message': 'Unauthorized access'}), 403

    user = db.session.get(User, id)

    if not user:
        return jsonify({'message': 'Invalid user id'}), 400

    try:
        user_data = user_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 400

    if 'name' in user_data:
        user.name = user_data['name']
    if 'address' in user_data:
        user.address = user_data['address']
    if 'email' in user_data:
        user.email = user_data['email']
    if 'password' in user_data:
        user.password = generate_password_hash(user_data['password'])
    db.session.commit()

    return user_schema.jsonify(user), 200

# Delete a user by ID
@app.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    current_user_id = int(get_jwt_identity())

    # Users can only delete their own profile
    if current_user_id != id:
        return jsonify({'message': 'Unauthorized access'}), 403

    user = db.session.get(User, id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'User deleted successfully'}), 200


# ----- Product Endpoints -----

# Retrieve all products
@app.route('/products', methods=['GET'])
def get_products():
    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    # Validate pagination parameters
    if page < 1 or per_page < 1:
        return jsonify({'message': 'Page and per_page must be positive integers'}), 400

    if per_page > 100:
        return jsonify({'message': 'per_page cannot exceed 100'}), 400

    # Use SQLAlchemy's paginate method
    query = select(Product)
    pagination = db.paginate(query, page=page, per_page=per_page, error_out=False)

    products = pagination.items

    return jsonify({
        'products': products_schema.dump(products),
        'pagination': {
            'page': pagination.page,
            'per_page': pagination.per_page,
            'total_pages': pagination.pages,
            'total_items': pagination.total,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev,
            'next_page': pagination.next_num if pagination.has_next else None,
            'prev_page': pagination.prev_num if pagination.has_prev else None
        }
    }), 200

# Retrieve a product by ID
@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = db.session.get(Product, id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    return product_schema.jsonify(product), 200

# Create a new product
@app.route('/products', methods=['POST'])
def create_product():
    try:
        product_data = product_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    new_product = Product(product_name=product_data['product_name'], price=product_data['price'])
    db.session.add(new_product)
    db.session.commit()

    return product_schema.jsonify(new_product), 201

# Update an existing product by ID
@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = db.session.get(Product, id)

    if not product:
        return jsonify({'message': 'Product not found'}), 404

    try:
        product_data = product_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 400

    if 'product_name' in product_data:
        product.product_name = product_data['product_name']
    if 'price' in product_data:
        product.price = product_data['price']
    db.session.commit()

    return product_schema.jsonify(product), 200

# Delete a product by ID
@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = db.session.get(Product, id)

    if not product:
        return jsonify({'message': 'Product not found'}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully'}), 200

# Delete multiple products by IDs
@app.route('/products/delete_multiple', methods=['DELETE'])
def delete_multiple_products():
    product_ids = request.json.get('product_ids', [])
    if not product_ids:
        return jsonify({'message': 'No product IDs provided'}), 400

    query = select(Product).where(Product.id.in_(product_ids))
    products = db.session.execute(query).scalars().all()

    if not products:
        return jsonify({'message': 'No valid products found for the provided IDs'}), 404

    for product in products:
        db.session.delete(product)
    db.session.commit()

    return jsonify({'message': f'Deleted {len(products)} products successfully'}), 200


# ----- Order Endpoints -----

# Create a new order
@app.route('/orders', methods=['POST'])
def create_order():
    try:
        order_data = order_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    # Verify user exists
    user = db.session.get(User, order_data['user_id'])
    if not user:
        return jsonify({'message': 'User not found'}), 404

    new_order = Order(user_id=order_data['user_id'])

    product_ids = request.json.get('product_ids', [])
    if not product_ids:
        return jsonify({'message': 'At least one product ID is required'}), 400

    # Verify and add products to order
    for product_id in product_ids:
        product = db.session.get(Product, product_id)
        if not product:
            return jsonify({'message': f'Product with ID {product_id} not found'}), 404
        new_order.products.append(product)

    db.session.add(new_order)
    db.session.commit()

    return order_schema.jsonify(new_order), 201

# Add a product to an existing order (prevent duplicates)
@app.route('/orders/<int:order_id>/add_product/<int:product_id>', methods=['PUT'])
def add_product_to_order(order_id, product_id):
    order = db.session.get(Order, order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    if product in order.products:
        return jsonify({'message': 'Product already in order'}), 400

    order.products.append(product)
    db.session.commit()

    return order_schema.jsonify(order), 200

# Remove a product from an existing order
@app.route('/orders/<int:order_id>/remove_product/<int:product_id>', methods=['DELETE'])
def remove_product_from_order(order_id, product_id):
    order = db.session.get(Order, order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    product = db.session.get(Product, product_id)
    if not product or product not in order.products:
        return jsonify({'message': 'Product not found in order'}), 404

    order.products.remove(product)
    db.session.commit()

    return order_schema.jsonify(order), 200

# Retrieve all orders for a specific user
@app.route('/orders/user/<int:user_id>', methods=['GET'])
def get_orders_by_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if not user.orders:
        return jsonify({'message': 'No orders found for this user'}), 404

    orders = user.orders
    return orders_schema.jsonify(orders), 200

# Get all products in a specific order
@app.route('/orders/<int:order_id>/products', methods=['GET'])
def get_products_in_order(order_id):
    order = db.session.get(Order, order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    if not order.products:
        return jsonify({'message': 'No products found in this order'}), 404

    products = order.products
    return products_schema.jsonify(products), 200


# ----- Additional Order Endpoints -----

# Retrieve all orders
@app.route('/orders', methods=['GET'])
def get_orders():
    query = select(Order)
    orders = db.session.execute(query).scalars().all()
    return orders_schema.jsonify(orders), 200

# Retrieve an order by ID
@app.route('/orders/<int:id>', methods=['GET'])
def get_order(id):
    order = db.session.get(Order, id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404
    return order_schema.jsonify(order), 200

# Update an order (change user or products)
@app.route('/orders/<int:id>', methods=['PUT'])
def update_order(id):
    order = db.session.get(Order, id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    try:
        order_data = order_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 400

    # Update user if provided
    if 'user_id' in order_data:
        user = db.session.get(User, order_data['user_id'])
        if not user:
            return jsonify({'message': 'User not found'}), 404
        order.user_id = order_data['user_id']

    # Update products if provided
    product_ids = request.json.get('product_ids')
    if product_ids is not None:
        order.products.clear()
        for product_id in product_ids:
            product = db.session.get(Product, product_id)
            if not product:
                return jsonify({'message': f'Product with ID {product_id} not found'}), 404
            order.products.append(product)

    db.session.commit()
    return order_schema.jsonify(order), 200

# Delete an order by ID
@app.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    order = db.session.get(Order, id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    db.session.delete(order)
    db.session.commit()
    return jsonify({'message': 'Order deleted successfully'}), 200

# Calculate total price of an order
@app.route('/orders/<int:order_id>/total', methods=['GET'])
def calculate_order_total(order_id):
    order = db.session.get(Order, order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    total = sum(product.price for product in order.products)
    return jsonify({
        'order_id': order_id,
        'total_price': round(total, 2),
        'product_count': len(order.products)
    }), 200

# Get order statistics for a user
@app.route('/users/<int:user_id>/order_stats', methods=['GET'])
def get_user_order_stats(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    total_orders = len(user.orders)
    total_spent = sum(
        sum(product.price for product in order.products)
        for order in user.orders
    )

    return jsonify({
        'user_id': user_id,
        'total_orders': total_orders,
        'total_spent': round(total_spent, 2)
    }), 200

# Get all orders containing a specific product
@app.route('/products/<int:product_id>/orders', methods=['GET'])
def get_orders_by_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    if not product.orders:
        return jsonify({'message': 'No orders found for this product'}), 404

    orders = product.orders
    return orders_schema.jsonify(orders), 200

# Get all users who ordered a specific product
@app.route('/products/<int:product_id>/users', methods=['GET'])
def get_users_by_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    users = {order.user for order in product.orders}
    if not users:
        return jsonify({'message': 'No users found for this product'}), 404

    return users_schema.jsonify(list(users)), 200

# Filter orders by date range
@app.route('/orders/filter', methods=['GET'])
def filter_orders_by_date():

    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    if not start_date or not end_date:
        return jsonify({'message': 'Please provide both start_date and end_date in YYYY-MM-DD format'}), 400

    try:
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

    query = select(Order).where(Order.order_date.between(start, end))
    orders = db.session.execute(query).scalars().all()

    if not orders:
        return jsonify({'message': 'No orders found in the given date range'}), 404

    return orders_schema.jsonify(orders), 200









# ------------------------- Run Server ---------------------------------

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True)