<!-- markdownlint-disable MD022 MD032 MD040 MD036 -->
# Catppuccin E-Commerce Store - Frontend

A beautiful, modern e-commerce frontend built with React, TypeScript, and styled with the Catppuccin Mocha theme.

## 🎨 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Redux Toolkit** - Global state management (auth, cart)
- **React Query (TanStack Query)** - Server state management
- **React Router** - Routing
- **Axios** - HTTP client
- **TailwindCSS 4** - Styling
- **Catppuccin Mocha** - Color theme

## 🚀 Features

- ✅ User authentication (register/login with JWT)
- ✅ Product browsing with pagination
- ✅ Shopping cart with localStorage persistence
- ✅ Order creation and history
- ✅ User profile management
- ✅ Protected routes
- ✅ Responsive design (mobile-first)
- ✅ Beautiful Catppuccin theme
- ✅ Optimistic UI updates
- ✅ Error handling and loading states

## 📁 Project Structure

```
src/
├── api/                    # API layer with axios
│   ├── axiosConfig.ts      # Axios instance with interceptors
│   ├── authApi.ts          # Authentication endpoints
│   ├── productsApi.ts      # Products CRUD
│   └── ordersApi.ts        # Orders CRUD
├── components/
│   ├── auth/               # Auth components
│   ├── common/             # Reusable components (Button, Input, etc.)
│   ├── layout/             # Layout components (Header, Footer)
│   └── products/           # Product components
├── features/               # Redux slices
│   ├── auth/               # Auth state
│   └── cart/               # Cart state
├── hooks/                  # Custom React hooks
├── pages/                  # Page components
├── store/                  # Redux store configuration
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ installed
- Backend API running at `http://localhost:5000`

### Install Dependencies

```bash
cd ecom-front
npm install
```

### Environment Variables

Create a `.env.development` file:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Catppuccin Store
VITE_ENABLE_DEVTOOLS=true
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Catppuccin Theme

The app uses the Catppuccin Mocha color palette:

- **Base Colors**: Mantle, Base, Crust
- **Text Colors**: Text, Subtext1, Subtext0
- **Surface Colors**: Surface0, Surface1, Surface2
- **Accent Colors**: Mauve (primary), Pink, Blue, Green, Red

All colors are defined as CSS variables in `src/index.css` and can be used with Tailwind's arbitrary values:

```tsx
className="bg-(--ctp-mauve) text-(--ctp-text)"
```

## 🔐 Authentication Flow

1. User registers → Backend creates user with hashed password
2. User logs in → Backend returns JWT token
3. Frontend stores token in localStorage
4. Token is automatically included in all API requests via Axios interceptor
5. Protected routes check authentication status
6. 401 responses automatically redirect to login

## 🛒 Cart Management

- Cart state managed by Redux
- Persisted to localStorage
- Synced across browser tabs
- Cleared on successful order placement

## 📡 API Integration

The frontend connects to the Flask backend with the following endpoints:

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login and get JWT
- `GET /users/me` - Get current user (protected)

### Products
- `GET /products?page=1&per_page=12` - List products (paginated)
- `GET /products/:id` - Get product details

### Orders
- `POST /orders` - Create order
- `GET /orders/user/:userId` - Get user's orders

### Users
- `PUT /users/:id` - Update user profile (protected)
- `DELETE /users/:id` - Delete account (protected)

## 🚀 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🐳 Docker Support

A Dockerfile is included for containerization. See `FRONTEND_PLAN.md` for deployment instructions.

## 📝 Key Components

### Redux Slices

- **authSlice**: User authentication state, token management
- **cartSlice**: Shopping cart items, quantities, totals

### Custom Hooks

- **useAuth**: Access auth state
- **useCart**: Cart operations (add, remove, update, clear)
- **useProducts**: React Query hook for products
- **useOrders**: React Query hook for orders

### Common Components

- **Button**: Styled button with variants (primary, secondary, danger, ghost)
- **Input**: Form input with label and error display
- **Loading**: Loading spinner
- **ErrorMessage**: Error display with retry option
- **Pagination**: Pagination controls

## 🎯 Features to Add (Future)

- Admin dashboard
- Product search and filters
- Product reviews
- Wishlist
- Payment integration (Stripe)
- Email notifications
- Order tracking
- Dark/light mode toggle
- Multi-language support

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Query](https://tanstack.com/query/latest)
- [TailwindCSS](https://tailwindcss.com)
- [Catppuccin](https://catppuccin.com)

## 👤 Author

**Sys-Redux**

## 📄 License

This project is open source and available under the MIT License
