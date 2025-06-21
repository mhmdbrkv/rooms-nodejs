# Rooms Node.js API

## Overview
This is a Node.js-based RESTful API for managing rooms, built with Express.js and MongoDB. It allows users to create, join, or book rooms (e.g., for meetings, chats, or events), with secure authentication and scalable architecture. The project leverages Object-Oriented Programming (OOP) principles for modular design, ensuring clean, maintainable code aligned with modern backend development practices.

## Features
- **Room Management**: Create, read, update, and delete (CRUD) rooms with details like name, capacity, and schedule.
- **User Authentication**: Secure signup/login using JWT.
- **Room Booking/Joining**: Users can book or join rooms based on availability.
- **Data Validation**: Robust input validation with Joi.
- **Error Handling**: Consistent error responses for reliable API usage.
- **Database**: MongoDB for scalable data storage.

## Tech Stack
- **Node.js**: Server-side runtime.
- **Express.js**: Framework for RESTful APIs.
- **MongoDB**: NoSQL database with Mongoose ODM.
- **JWT**: For secure authentication.
- **Joi**: For request validation.
- **Git**: Version control.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mhmdbrkv/rooms-nodejs.git
   cd rooms-nodejs
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/rooms
   JWT_SECRET=your_jwt_secret_key
   ```
4. **Start MongoDB**:
   Ensure MongoDB is running locally or provide a cloud MongoDB URI.
5. **Run the Application**:
   ```bash
   npm start
   ```
   The API is available at `http://localhost:3000`.

## API Endpoints
- **POST /api/auth/signup**: Register a new user.
- **POST /api/auth/login**: Authenticate and receive a JWT.
- **POST /api/rooms**: Create a new room (requires authentication).
- **GET /api/rooms**: List all rooms.
- **GET /api/rooms/:id**: Get room details by ID.
- **PUT /api/rooms/:id**: Update a room (requires authentication).
- **DELETE /api/rooms/:id**: Delete a room (requires authentication).
- **POST /api/rooms/:id/join**: Join or book a room.

## Usage
1. Sign up or log in to obtain a JWT token.
2. Include the token in the `Authorization` header (`Bearer <token>`) for protected routes.
3. Create, manage, or join rooms using the provided endpoints.

## Project Structure
```
rooms-nodejs/
├── controllers/      # API request handlers
├── models/          # Mongoose schemas (Room, User)
├── routes/          # Express route definitions
├── middlewares/     # Authentication and validation middleware
├── config/          # Database and app configurations
├── .env             # Environment variables
├── server.js        # Application entry point
└── README.md        # Project documentation
```

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
MIT License. See [LICENSE](LICENSE) for details.

## Contact
Reach out to [mhmdbrkv](https://github.com/mhmdbrkv) for questions or feedback.
