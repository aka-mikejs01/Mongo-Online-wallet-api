# Online Wallet API (MongoDB)

A simple and secure RESTful API for an online wallet system built with **Node.js**, **Express**, and **MongoDB**. It supports user registration, balance tracking, money transfers, and transaction history.

## Features

* User registration and login
* Transfer funds between users
* View transaction history
* MongoDB transactions for data integrity
* Input validation with `express-validator`

## Technologies Used

* Node.js
* Express.js
* MongoDB + Mongoose
* express-validator
* cookie-parser
* morgan & winston
* bcryptjs
* jsonwebtoken

## Getting Started

### Prerequisites

* Node.js v18+
* MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/aka-mikejs01/Mongo-Online-wallet-api.git
cd online-wallet-api
npm install
```

### Setup Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### Run the Server

```bash
npm run dev
```

## API Endpoints

### POST /api/auth/register

Register a new user

### POST /api/auth/login

Login user and receive token

### POST /api/auth/logout

Cleares the token and logs out

### POST /api/wallet/transfer

Transfer funds (uses MongoDB transactions)

### GET /api/wallet/history

Get transaction history for the logged-in user

### GET /api/wallet/balance

Gets you remaning balance

## License

MIT
