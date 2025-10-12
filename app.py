# Setting up a flask app with MySQL connection
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow import ValidationError
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Table, String, Column, DateTime, func, select
from typing import List

# Initialize Flask app
app = Flask(__name__)

# MySQL DB Connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:<PASSWORD>@localhost/ecommerce_flaskapi'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Base Model
class Base(DeclarativeBase):
    pass

# Initialize SQLAlchemy and Marshmallow
db = SQLAlchemy(model_class=Base)
db.init_app(app)
ma = Marshmallow(app)


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
    class Meta:
        model = User

class OrderSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Order
        include_fk = True

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

# Create a new user
@app.route('/users', methods=['POST'])
def create_user():
    try:
        user_data = user_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    new_user = User(name=user_data['name'], email=user_data['email'])
    db.session.add(new_user)
    db.session.commit()

    return user_schema.jsonify(new_user), 201

# Update an existing user by ID
@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = db.session.get(User, id)

    if not user:
        return jsonify({'message': 'User not found'}), 400

    try:
        user_data = user_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    user.name = user_data['name']
    user.address = user_data['address']
    user.email = user_data['email']
    db.session.commit()

    return user_schema.jsonify(user), 200

# Delete a user by ID
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = db.session.get(User, id)

    if not user:
        return jsonify({'message': 'Invalid user id'}),400

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'User deleted successfully'}), 200


# ----- Product Endpoints -----

# Retrieve all products
@app.route('/products', methods=['GET'])
def get_products():
    query = select(Product)
    products = db.session.execute(query).scalars().all()
    return products_schema.jsonify(products), 200

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
        product_data = product_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    product.product_name = product_data['product_name']
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


# Run the Flask app

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True)