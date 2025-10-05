# Book Review Platform

A full-stack book review platform built with React, Express.js, and MongoDB Atlas.

## Features

- **Authentication**: JWT-based user authentication with bcrypt password hashing
- **Public Access**: Browse all books and their ratings without logging in
- **Book Management**: Add, edit, and delete books (user can only manage their own books)
- **Reviews & Ratings**: Rate books from 1-5 stars and write detailed reviews
- **User Profiles**: View personal statistics with interactive graphs showing rating distributions
- **Pagination**: Navigate through large book collections with ease
- **Dark/Light Mode**: Toggle between themes with persistent storage
- **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Vite for building

**Backend:**
- Node.js with Express.js
- MongoDB Atlas for database
- Mongoose for MongoDB object modeling
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install Frontend Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

### Running the Application

1. **Start the Backend Server**
```bash
cd server
npm start
```
The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

3. **Access the Application**

Open your browser and navigate to `http://localhost:5173`

## Usage

### For Visitors (No Account Required)

- Browse all books on the home page
- View book details including ratings and reviews
- Use pagination to navigate through books

### For Registered Users

1. **Sign Up**: Create an account with username, email, and password
2. **Log In**: Access your account to unlock additional features
3. **Add Books**: Submit new books with title, author, genre, year, description, and cover image
4. **Write Reviews**: Rate and review books (1-5 stars)
5. **Edit/Delete**: Manage only your own books and reviews
6. **Profile Dashboard**: View your activity statistics with visual graphs

## Project Structure

```
project/
├── src/                      # Frontend source files
│   ├── components/          # Reusable React components
│   ├── context/             # React context providers (Auth, Theme)
│   ├── pages/               # Page components
│   ├── utils/               # Utility functions (API client)
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── server/                   # Backend source files
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── middleware/          # Custom middleware
│   └── server.js            # Server entry point
└── README.md                # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books (public)
- `GET /api/books/:id` - Get book details (public)
- `POST /api/books` - Create new book (protected)
- `PUT /api/books/:id` - Update book (protected, owner only)
- `DELETE /api/books/:id` - Delete book (protected, owner only)

### Reviews
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (protected, owner only)
- `DELETE /api/reviews/:id` - Delete review (protected, owner only)

### Profile
- `GET /api/profile` - Get user profile with statistics (protected)

## Features in Detail

### Dark/Light Mode
Toggle between themes using the moon/sun icon in the navbar. Preference is saved to localStorage.

### Rating System
- 1-5 star rating system
- Average ratings calculated automatically
- Visual star displays throughout the app

### Profile Statistics
- Total books added
- Total reviews given
- Total reviews received
- Rating distribution graphs for received ratings
- Rating distribution graphs for given ratings

### User Ownership
- Users can only edit/delete their own books
- Users can only edit/delete their own reviews
- One review per user per book

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Environment Variables

Backend environment variables are configured in `server/.env`:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 5000)

## License

This project is open source and available for educational purposes.
