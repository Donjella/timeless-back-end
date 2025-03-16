# Timeless Luxury Watch Rental - Backend 

## Table of Contents


## Overview
The **Luxury Watch Backend** is a high-performance, scalable **Node.js & Express API** designed to handle watch rentals, user authentication, payment processing, and brand management. Built with **MongoDB**, it ensures flexibility in handling structured and unstructured data efficiently. This backend follows industry best practices in security, maintainability, and performance.

## Chosen industry-relevant technologies and their alternatives
To ensure this project meets industry standards, we have carefully selected technologies that enhance **performance, security, scalability, and ease of maintenance**. 

Below is a detailed explanation of the **software and hardware** requirements for running this backend efficiently, why they are chosen for this project compared against their alternatives and their licensing details.


## Software Technologies

### **Backend Framework: Node.js & Express.js**
The backend is built using **Node.js**, a **non-blocking, event-driven runtime**, and **Express.js**, a lightweight web framework that simplifies API development. Node.js is widely used in **high-performance applications** like Netflix, LinkedIn, and PayPal due to its **asynchronous nature**, making it ideal for handling multiple user requests efficiently.

- **Why Express.js?**
  - Lightweight and easy to use for RESTful API development.
  - Supports **middleware** for structured routing and error handling.
  - Excellent **performance** for I/O-heavy operations like database queries.

- **Comparison with alternatives:**
  - **Django (Python):** Great for rapid development and built-in admin panel, but its synchronous nature makes it less efficient for high-concurrency applications.
  - **Spring Boot (Java):** Excellent for large-scale enterprise applications but has a **steeper learning curve** and requires more configuration.
  - **ASP.NET (C#):** Highly scalable and secure, but **tightly integrated with the Microsoft ecosystem**, making it less flexible for open-source projects.

  **Node.js is preferred** for this project due to its **asynchronous, event-driven architecture**, which enables handling **thousands of concurrent requests** efficiently without blocking execution.

### **Database: MongoDB & Mongoose**
**MongoDB**, a NoSQL database, is used to store data for **users, rentals, payments, brands, and watches**. It allows **schema flexibility**, which is beneficial for handling dynamic data structures.

- **Why MongoDB?**
  - **Scalable** and optimized for large data loads.
  - **Flexible document-based storage** allows easy data modeling.
  - Supports **replication and sharding** for high availability and performance.

- **Mongoose ODM (Object Data Modeling)**
  - Provides a **structured way** to interact with MongoDB.
  - Enforces **schema validation** and supports middleware/hooks.

- **Comparison with alternatives:**
  - **PostgreSQL (Relational Database):** Highly structured and ensures data integrity, but schema modifications can be complex.
  - **MySQL (Relational Database):** Great for structured data but lacks MongoDB’s flexibility in handling JSON-like documents.
  - **Firebase (Cloud NoSQL):** Easy to use but **less control over querying and indexing** compared to MongoDB.

   **MongoDB is preferred** due to its ability to scale horizontally, handle semi-structured data efficiently, and integrate seamlessly with Node.js.

### **MongoDB Atlas: Cloud Database**
This backend leverages **MongoDB Atlas**, a fully managed cloud database service that offers:
- **Automatic scaling** based on demand.
- **Built-in security** with encryption and access control.
- **Automated backups** to ensure data safety.
- **Global distribution** for low-latency access worldwide.

### **Authentication & Security: JWT & Bcrypt.js**
For authentication, **JSON Web Tokens (JWT)** are used to handle user logins securely. **Bcrypt.js** ensures passwords are **hashed** and protected from brute-force attacks.

- **Why JWT?**
  - Stateless authentication mechanism, making it ideal for **scalable applications**.
  - Securely encodes user session data in tokens.
  - Used by **Google, Facebook, and GitHub** for authentication.

- **Why Bcrypt.js?**
  - Uses **adaptive hashing**, meaning it gets **slower over time** to prevent brute-force attacks.
  - Widely used in **banking, healthcare, and enterprise applications**.

- **Comparison with alternatives:**
  - **OAuth2:** More secure for third-party authentication but **complex to implement** for simple applications.
  - **Firebase Authentication:** Easy to set up but **less customizable** compared to JWT.

  **JWT was chosen** for its **simplicity, scalability, and ability to work across multiple platforms**.

### **Middleware & Error Handling**
To ensure **smooth API responses and error consistency**, the project implements middleware such as:

- **Express-Async-Handler**: Handles async errors efficiently.
- **CORS Middleware**: Allows **cross-origin resource sharing**, enabling frontend communication.
- **Global Error Handler**: A structured way to catch and respond to all errors gracefully.

## Hardware Requirements
The backend must run efficiently **both in development (local machine) and production (cloud server)**. Below are the recommended system requirements.

### **1️. Development Environment (Local Machine)**
For local development, you need a machine capable of running **Node.js, MongoDB, and a testing environment**.

#### **Recommended specs:**
- **Operating System:** Windows, macOS, or Linux
- **Processor:** Intel Core i5 / AMD Ryzen 5 (or higher)
- **Memory (RAM):** **8GB minimum, 16GB recommended**
- **Storage:** At least **10GB free SSD space**
- **MongoDB:** Install locally or use MongoDB Atlas (Cloud Database)

### **2️. Production Environment (Cloud Hosting)**
For deploying this backend on **Render, AWS, or DigitalOcean**, a cloud server must handle multiple API requests efficiently.

#### **Recommended specs:**
- **CPU:** 2-4 virtual CPUs (vCPUs) for handling concurrent requests.
- **Memory (RAM):** **4GB minimum (16GB for high traffic environments)**
- **Storage:** **20GB+ SSD** for storing logs, backups, and database data.
- **Database:** **MongoDB Atlas** or **self-hosted MongoDB instance**.
- **Security:** **Enable HTTPS, firewall rules, and automatic backups**.  

## Project Dependencies

### Core Dependencies

Core dependencies are essential for the application's backend functionality:

### 1. Express.js (v4.21.2)
- **Purpose**: Handles routing, middleware, and API requests
- **Key Features**:
  - Easy-to-use framework for building REST APIs
  - Flexible routing mechanism
  - Middleware support

### 2. MongoDB Atlas
- **Purpose**: Cloud-based NoSQL Database
- **Key Features**:
  - Stores users, rentals, payments, brands, and watches
  - Flexible document storage
  - Scalability and cloud-based management
  - Automatic backups

### 3. Mongoose (v8.12.1)
- **Purpose**: Object Data Modeling (ODM) for MongoDB
- **Key Features**:
  - Simplifies database interactions
  - Schema validation
  - Middleware support
  - Data modeling and schema enforcement

### 4. bcryptjs (v3.0.2)
- **Purpose**: Secure Password Hashing
- **Key Features**:
  - Securely hashes passwords
  - Protects against rainbow table attacks
  - Prevents brute-force password attempts

### 5. jsonwebtoken (v9.0.2)
- **Purpose**: Authentication and Authorization
- **Key Features**:
  - Implements JWT-based authentication
  - Stateless security mechanism
  - Secure user session management without server-side storage

### 6. dotenv (v16.4.7)
- **Purpose**: Environment Configuration
- **Key Features**:
  - Loads environment variables
  - Keeps sensitive credentials out of source code
  - Supports different configurations for various environments

### 7. helmet (v8.0.0)
- **Purpose**: Web Security
- **Key Features**:
  - Adds security headers
  - Protects against common web vulnerabilities
  - Prevents XSS and clickjacking attacks

### 8. express-validator (v7.2.1)
- **Purpose**: Request Validation
- **Key Features**:
  - Validates incoming request data
  - Prevents SQL injection
  - Ensures data integrity

### 9. cors (v2.8.5)
- **Purpose**: Cross-Origin Resource Sharing
- **Key Features**:
  - Enables cross-origin requests
  - Secures API communication
  - Configurable origin and method restrictions

### Development Dependencies

Development dependencies support testing, linting, and code quality:

### 1. Jest (v29.7.0)
- **Purpose**: Testing Framework
- **Key Features**:
  - Unit and integration testing
  - Mocking capabilities
  - Code coverage reporting

### 2. Supertest (v7.0.0)
- **Purpose**: HTTP Testing
- **Key Features**:
  - Sends HTTP requests for API testing
  - Integrates seamlessly with Jest
  - Supports complex API endpoint testing

### 3. ESLint (v8.57.1)
- **Purpose**: Code Linting
- **Key Features**:
  - Enforces coding standards
  - Identifies potential errors
  - Improves code quality and readability

### 4. ESLint Airbnb Configuration (v15.0.0)
- **Purpose**: Coding Style Guide
- **Key Features**:
  - Implements Airbnb's JavaScript best practices
  - Ensures consistent code style
  - Encourages clean, maintainable code

### 5. ESLint Import Plugin (v2.31.0)
- **Purpose**: Import/Export Management
- **Key Features**:
  - Validates import and export syntax
  - Prevents common import-related issues
  - Ensures proper dependency management

## Dependency Management

- **Package Manager**: npm
- **Version Control**: Specified in `package.json`
- **Update Strategy**: Regular security and feature updates
- **Installation**: `npm install`

### Recommended Versions

Always refer to the latest `package.json` for exact version compatibility. It's recommended to:
- Keep dependencies updated
- Run `npm audit` regularly
- Update with caution, testing thoroughly

## Licensing Details

### Backend Framework: Node.js & Express.js

- **Node.js**: MIT License
  - Allows free use in commercial and non-commercial projects
  - Permits modification, distribution, and private use
  - Requires preservation of copyright and license notices
  - No warranty or liability

- **Express.js**: MIT License
  - Similar permissive open-source licensing to Node.js
  - Allows commercial use without requiring source code disclosure
  - Minimal restrictions on usage and modification

### Database: MongoDB & Mongoose

- **MongoDB**: Server Side Public License (SSPL)
  - Requires source code availability for service providers
  - Free for most development and production use
  - Restrictions on offering MongoDB as a service without open-sourcing
  - Allows commercial use with specific conditions

- **Mongoose**: MIT License
  - Completely free for commercial and personal use
  - Allows unlimited modifications
  - No requirements to open-source derivative works

### Authentication Technologies

- **JWT (JSON Web Tokens)**: MIT License
  - Free for commercial and non-commercial use
  - No restrictions on modifications
  - Widely adopted across industry standards

- **Bcrypt.js**: BSD-3-Clause License
  - Allows free use in commercial and open-source projects
  - Requires attribution
  - Prohibits using contributors' names for product endorsement

### Security Middleware

- **Helmet.js**: MIT License
  - Free for commercial and personal use
  - No restrictions on modifications
  - Minimal licensing requirements

- **CORS Middleware**: MIT License
  - Allows unrestricted use
  - No cost for commercial applications
  - Provides flexibility in cross-origin resource sharing

### Development and Testing Tools

- **Jest**: MIT License
  - Free for all types of projects
  - Allows modifications and redistributions
  - No cost for commercial use

- **ESLint**: MIT License
  - Completely open-source
  - Free for commercial and personal projects
  - No restrictions on usage or modification

## Application Setup

### **1️. Clone the Repository**
```bash
git clone https://github.com/yourusername/luxury-watch-backend.git
cd luxury-watch-backend
```

### **2️. Install Dependencies**
```bash
npm install
```

### **3️. Set Up Environment Variables**
Create a `.env` file in the project root with the following values:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:5173
```

### **4. Start the Development Server**
```bash
npm run dev
```
This starts the backend with **hot-reloading**.

### **5. Running Tests**
To execute unit and integration tests:
```bash
npm run test
```

To run a specific test file:
```bash
npx jest src/tests/userController.test.js
```

### **6️. Production Deployment**
Deploy using **Render, AWS, or DigitalOcean**:
```bash
npm start
```

