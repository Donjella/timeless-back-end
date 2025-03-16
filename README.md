# Timeless Luxury Watch Rental - Backend 

## Table of Contents

- [Overview](#overview)
- [Industry-Relevant Technologies and Their Alternatives](#industry-relevant-technologies-and-their-alternatives)
  - [Backend Framework: Node.js & Express.js](#backend-framework-nodejs--expressjs)
  - [Database: MongoDB & Mongoose](#database-mongodb--mongoose)
  - [Cloud Database: MongoDB Atlas](#cloud-database-mongodb-atlas)
  - [Authentication & Security: JWT & Bcrypt.js](#authentication--security-jwt--bcryptjs)
  - [Middleware & Error Handling](#middleware--error-handling)
- [Hardware Requirements](#hardware-requirements)
  - [Development Environment (Local Machine)](#1-development-environment-local-machine)
  - [Production Environment (Cloud Hosting)](#2-production-environment-cloud-hosting)
- [Coding Style Guide and Conventions](#coding-style-guide-and-conventions)
  - [Airbnb JavaScript Style Guide](#airbnb-javascript-style-guide)
  - [ESLint Implementation](#eslint-implementation)
  - [Naming Conventions](#naming-conventions)
  - [Key Style Principles](#key-style-principles)
  - [Practical Implementation](#practical-implementation)
- [Project Dependencies](#project-dependencies)
  - [Core Dependencies](#core-dependencies)
  - [Development Dependencies](#development-dependencies)
  - [Dependency Management](#dependency-management)
- [Application Setup](#application-setup)
  - [Clone the Repository](#1-clone-the-repository)
  - [Install Dependencies](#2-install-dependencies)
  - [Set Up Environment Variables](#3-set-up-environment-variables)
  - [Start the Development Server](#4-start-the-development-server)
  - [Running Tests](#5-running-tests)
  - [Production Deployment](#6-production-deployment)

## Overview
The **Luxury Watch Backend** is a high-performance, scalable **Node.js & Express API** designed to handle watch rentals, user authentication, payment processing, and brand management. Built with **MongoDB**, it ensures flexibility in handling structured and unstructured data efficiently. This backend follows industry best practices in security, maintainability, and performance.

## Industry-Relevant Technologies and Their Alternatives
To ensure this project meets industry standards, we have carefully selected technologies that enhance **performance, security, scalability, and ease of maintenance**. Each technology choice is explained below with its industry relevance, purpose, alternatives, and licensing details.

### Backend Framework: Node.js & Express.js
The backend is built using **Node.js**, a **non-blocking, event-driven runtime**, and **Express.js**, a lightweight web framework that simplifies API development.

- **Industry Relevance**: 
  - Used by major companies like **Netflix, LinkedIn, and PayPal**
  - Widely adopted for building scalable web services
  - Strong community support with regular updates and security patches

- **Purpose in Our Project**:
  - Provides the foundation for our REST API architecture
  - Handles HTTP requests for user authentication, watch management, and rental operations
  - Enables efficient database operations through asynchronous processing

- **Alternatives Comparison**:
  - **Django (Python):** Great for rapid development with built-in admin panel, but its synchronous nature makes it less efficient for high-concurrency applications
  - **Spring Boot (Java):** Excellent for large-scale enterprise applications but has a **steeper learning curve** and requires more configuration
  - **ASP.NET (C#):** Highly scalable and secure, but **tightly integrated with the Microsoft ecosystem**, making it less flexible for open-source projects

- **Licensing**:
  - **Node.js**: MIT License - Permits commercial and private use, modification, and distribution with minimal restrictions
  - **Express.js**: MIT License - Same permissions and conditions as Node.js, fully compatible with commercial projects

### Database: MongoDB & Mongoose
**MongoDB**, a NoSQL database, is used to store data for **users, rentals, payments, brands, and watches**. **Mongoose** provides an Object Data Modeling (ODM) layer for structured interaction with MongoDB.

- **Industry Relevance**:
  - Used by companies like **Uber, eBay, and Electronic Arts**
  - Ideal for applications requiring rapid development and flexible data models
  - Excellent for handling JSON-like data structures

- **Purpose in Our Project**:
  - Stores all application data including user profiles, watch inventory, rental records, and payment information
  - Provides flexible schema that adapts to evolving business requirements
  - Enables efficient querying for watch filtering and rental management

- **Alternatives Comparison**:
  - **PostgreSQL:** Highly structured and ensures data integrity, but schema modifications can be complex for rapidly evolving applications
  - **MySQL:** Great for structured data but lacks MongoDB's flexibility in handling JSON-like documents
  - **Firebase:** Easy to use but provides **less control over querying and indexing** compared to MongoDB

- **Licensing**:
  - **MongoDB**: Server Side Public License (SSPL) - Free for most use cases including local development and standard production deployment; requires source code disclosure if offering MongoDB as a service
  - **Mongoose**: MIT License - Permits commercial and private use without restrictions

### Cloud Database: MongoDB Atlas
For production, we leverage **MongoDB Atlas**, a fully managed cloud database service.

- **Industry Relevance**:
  - Used by thousands of companies for production MongoDB deployments
  - Considered the industry standard for managed MongoDB hosting
  - Supported directly by MongoDB, Inc., ensuring latest features and security updates

- **Purpose in Our Project**:
  - Provides production-ready database environment with minimal setup
  - Ensures data persistence, backup, and security for our application
  - Simplifies database management with automated monitoring and scaling

- **Key Features**:
  - **Automatic scaling** based on demand
  - **Built-in security** with encryption and access control
  - **Automated backups** to ensure data safety
  - **Global distribution** for low-latency access worldwide

- **Alternatives Comparison**:
  - **Self-hosted MongoDB:** Lower monthly costs but requires significant DevOps expertise
  - **Amazon DocumentDB:** Compatible with MongoDB but lacks some advanced features
  - **Google Cloud Firestore:** Easier to set up but offers less control and configuration options

- **Licensing**:
  - **MongoDB Atlas**: Service-based subscription - Free tier available for development and small production workloads; paid tiers based on storage, memory, and CPU requirements

### Authentication & Security: JWT & Bcrypt.js
For authentication, **JSON Web Tokens (JWT)** are used to handle user logins securely. **Bcrypt.js** ensures passwords are **hashed** and protected from brute-force attacks.

- **Industry Relevance**:
  - JWT is used by **Google, Facebook, and GitHub** for authentication
  - Bcrypt is an industry-standard for password hashing in **banking, healthcare, and enterprise applications**
  - Both technologies are considered security best practices in web development

- **Purpose in Our Project**:
  - Implements secure user authentication and authorization
  - Protects user credentials through industry-standard password hashing
  - Enables role-based access control for admin versus regular user functionality

- **Alternatives Comparison**:
  - **OAuth2:** More secure for third-party authentication but **complex to implement** for simple applications
  - **Firebase Authentication:** Easy to set up but **less customizable** compared to JWT
  - **Passport.js:** More feature-rich but adds complexity for our straightforward authentication needs

- **Licensing**:
  - **JWT (jsonwebtoken package)**: MIT License - Free for commercial use with no restrictions
  - **Bcrypt.js**: MIT License - No restrictions on usage in our application

### Middleware & Error Handling
To ensure **smooth API responses and error consistency**, the project implements various middleware components.

- **Industry Relevance**:
  - Standard approach in modern API development
  - Used by enterprise-grade applications for error handling and request processing
  - Considered best practice for maintainable API design

- **Purpose in Our Project**:
  - Ensures standardized API responses across all endpoints
  - Centralizes error handling to improve debugging and user experience
  - Enables cross-origin requests for frontend integration
  - Protects routes from unauthorized access
  - Implements role-based access control

- **Custom Middleware Implementation**:

  **1. Authentication Middleware (`authMiddleware.js`)**
  ```javascript
  const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        [, token] = req.headers.authorization.split(' ');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    } else {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
  });

  const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
  };
  ```

  **2. Error Handler (`errorHandler.js`)**
  ```javascript
  const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Internal Server Error';

    if (err instanceof AppError) {
      statusCode = err.statusCode || 500;
      message = err.message;
    }

    switch (err.name) {
      case 'ValidationError':
        statusCode = 400;
        message = err.message || 'Validation Error';
        break;
      case 'CastError':
        statusCode = 400;
        message = `Invalid ${err.path}`;
        break;
      case 'JsonWebTokenError':
      case 'TokenExpiredError':
        statusCode = 401;
        message = 'Invalid or expired token, please log in again';
        break;
      default:
        break;
    }

    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    });
  };
  ```

  **3. Payment Middleware (`paymentMiddleware.js`)**
  ```javascript
  const setPaymentDateOnComplete = function updatePaymentDate(next) {
    if (this.isModified('payment_status') && this.payment_status === 'Completed') {
      this.payment_date = new Date();
    }
    next();
  };
  ```

- **Key Middleware Components**:
  - **Authentication Middleware** (`authMiddleware.js`): Protects routes and verifies admin roles
  - **Error Handler** (`errorHandler.js`): Provides consistent error responses across the API
  - **Payment Middleware** (`paymentMiddleware.js`): Handles payment-specific logic like setting payment dates
  - **Express-Async-Handler**: Simplifies async error handling in route controllers
  - **CORS Middleware**: Allows **cross-origin resource sharing**, enabling frontend communication

- **Alternatives Comparison**:
  - **Try-Catch Blocks:** More verbose and prone to inconsistent error handling
  - **Custom Middleware:** Requires more development time but can be tailored to specific needs
  - **Third-party API Gateways:** Offer more features but add complexity and cost

- **Licensing**:
  - **express-async-handler**: MIT License - Free for commercial use with no restrictions
  - **cors**: MIT License - Permits unrestricted use in both commercial and non-commercial applications

## Hardware Requirements
The backend must run efficiently in both development and production environments. Below are the recommended system requirements.

### 1. Development Environment (Local Machine)
For local development, you need a machine capable of running **Node.js, MongoDB, and a testing environment**.

- **Operating System:** Windows, macOS, or Linux
- **Processor:** Intel Core i5 / AMD Ryzen 5 (or higher)
- **Memory (RAM):** **8GB minimum, 16GB recommended**
- **Storage:** At least **10GB free SSD space**
- **MongoDB:** Install locally or use MongoDB Atlas (Cloud Database)

### 2. Production Environment (Cloud Hosting)
For deploying this backend on **Render, AWS, or DigitalOcean**, a cloud server must handle multiple API requests efficiently.

- **CPU:** 2-4 virtual CPUs (vCPUs) for handling concurrent requests
- **Memory (RAM):** **4GB minimum (16GB for high traffic environments)**
- **Storage:** **20GB+ SSD** for storing logs, backups, and database data
- **Database:** **MongoDB Atlas** or **self-hosted MongoDB instance**
- **Security:** **Enable HTTPS, firewall rules, and automatic backups**
- **Network:** Reliable internet connection with adequate bandwidth for API traffic

- **Cloud Service Considerations**:
  - **AWS/DigitalOcean/Render**: Pay-as-you-go service model; no additional software licensing costs beyond usage fees
  - **MongoDB Atlas**: Tiered subscription model; free tier available for development and small applications
  
## Coding Style Guide and Conventions

### Airbnb JavaScript Style Guide

The project adheres to the **Airbnb JavaScript Style Guide**, a comprehensive and widely-adopted coding standard that ensures code quality, consistency, and maintainability.

- **Industry Relevance**:
  - Developed and used by leading technology companies
  - Widely adopted in the JavaScript and Node.js ecosystem
  - Reflects best practices in modern JavaScript development

- **Purpose in Our Project**:
  - Enforces consistent code formatting
  - Prevents potential errors and anti-patterns
  - Improves code readability and maintainability

### ESLint Implementation

Our project leverages ESLint to automatically enforce the Airbnb JavaScript Style Guide:

```bash
# Installation of compatible packages
npm install --save-dev eslint@8 eslint-config-airbnb-base eslint-plugin-import
```

> **Important Note on Compatibility**: We specifically install ESLint v8 because the Airbnb config (`eslint-config-airbnb-base`) is currently compatible only with ESLint v8.x and has compatibility issues with ESLint v9.x.

#### Integration in Development Workflow

1. **NPM Scripts for Linting**
   ```json
   "scripts": {
     "lint": "eslint .",
     "lint:fix": "eslint . --fix"
   }
   ```

   **Running ESLint from the Command Line:**
   ```bash
   # Run ESLint on all files
   npx eslint .
   
   # Run ESLint with automatic fixing
   npx eslint . --fix
   
   # Run ESLint on a specific file or directory
   npx eslint controllers/userController.js
   ```

2. **Editor Integration**
   * VSCode ESLint extension configured for real-time feedback
   * Provides immediate visual feedback on code style issues
   * Allows quick fixes directly in the editor

3. **Manual Code Reviews**
   * Team members review code for style guide compliance
   * ESLint rules serve as objective criteria during reviews

The configuration file (.eslintrc.json) extends the Airbnb base configuration with project-specific customizations:

```json
{
  "extends": "airbnb-base",
  "env": {
    "node": true,
    "es6": true,
    "es2021": true,
    "jest": true
  },
  "plugins": ["import"],
  "rules": {
    "no-console": "off",
    "consistent-return": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
    "no-underscore-dangle": "off",
    "import/no-unresolved": ["error", { "commonjs": true }],
    "camelcase": [
      "error",
      {
        "properties": "never",
        "ignoreDestructuring": true,
        "ignoreImports": true,
        "allow": [
          "^brand_",
          "^first_",
          "^last_",
          "^street_",
          "^payment_",
          "^postal_",
          "^watch_",
          "^total_",
          "^user_",
          "^rental_"
        ]
      }
    ]
  }
}
```

### Naming Conventions

- **JavaScript Variables and Functions**: Use camelCase (e.g., `getUserProfile()`, `createRental()`)
- **Database and Schema Fields**: Use snake_case for database-related fields as configured in our ESLint rules (e.g., `first_name`, `watch_id`, `rental_status`)

**Reasoning for Flexible Naming**:
- Aligns with MongoDB's document-based structure
- Allows semantic grouping of related fields
- Maintains database-specific naming conventions
- Provides clarity in complex domain models

### Key Style Principles

1. **Consistent Formatting**
   - 2-space indentation
   - Descriptive variable and function names
   - Clear, concise code structure

2. **Error Handling**
   - Consistent approach to error management
   - Use of middleware for async error handling
   - Meaningful error messages

3. **Import and Module Management**
   - Organized import statements
   - Clear module exports
   - Minimal use of default exports

### Practical Implementation

**Model Design Example**:

```javascript
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  }
});
```

**Controller Example**:

```javascript
// Calculate rental dates and total price
const total_rental_price = watch.rental_day_price * rental_days;
const rental_start_date = new Date();
const rental_end_date = new Date();
rental_end_date.setDate(rental_start_date.getDate() + rental_days);

// Create rental
const rental = await Rental.create({
  user: req.user._id,
  watch: watch_id,
  rental_days,
  total_rental_price,
  rental_start_date,
  rental_end_date,
  rental_status: 'Pending',
});
```

## Project Dependencies

### Core Dependencies

1. **Express.js (v4.21.2)**
   - **Purpose**: Foundation of our API, handling all HTTP requests
     * Creates RESTful API endpoints for user authentication, watch management, and rental processing
     * Implements route handling for all business operations
     * Provides middleware support for authentication and error handling
     * Enables structured response formatting
   - **Industry Relevance**: Most popular Node.js framework for web applications
   - **License**: MIT License

2. **MongoDB**
   - **Purpose**: NoSQL database for storing application data
     * Stores user profiles, watch inventory, rental records, and payment information
     * Enables flexible document structure for evolving business requirements
     * Provides high performance for read/write operations
     * Supports indexing for efficient querying
   - **Industry Relevance**: Leading NoSQL database for web applications
   - **License**: SSPL (Server Side Public License)

3. **Mongoose (v8.12.1)**
   - **Purpose**: Object Data Modeling (ODM) for MongoDB
     * Defines structured schemas for User, Watch, Brand, Rental, and Payment models
     * Validates data before saving to database
     * Implements middleware hooks for password hashing and payment date updates
     * Simplifies relationships between collections
     * Provides query building with chainable methods
   - **Industry Relevance**: Standard ODM for MongoDB in Node.js applications
   - **License**: MIT License

4. **bcryptjs (v3.0.2)**
   - **Purpose**: Secure password hashing and comparison
     * Hashes user passwords before storage in database
     * Compares login attempts with stored hashed passwords
     * Implements salt rounds for enhanced security
     * Prevents plain text password storage
   - **Industry Relevance**: Industry standard for password security
   - **License**: MIT License

5. **jsonwebtoken (v9.0.2)**
   - **Purpose**: Authentication token generation and verification
     * Creates signed JWT tokens upon successful login
     * Verifies token validity in protect middleware
     * Extracts user information from tokens
     * Enables stateless authentication across API
     * Supports token expiration for security
   - **Industry Relevance**: Standard for stateless authentication
   - **License**: MIT License

6. **dotenv (v16.4.7)**
   - **Purpose**: Environment configuration management
     * Loads environment variables from .env file
     * Manages different configurations for development and production
     * Secures sensitive information like database credentials and JWT secret
     * Simplifies deployment across environments
   - **Industry Relevance**: Standard approach for configuration
   - **License**: BSD-2-Clause License

7. **helmet (v8.0.0)**
   - **Purpose**: HTTP header security
     * Sets security-related HTTP headers
     * Protects against XSS attacks
     * Prevents clickjacking
     * Implements Content Security Policy
     * Disables X-Powered-By header to hide technology stack
   - **Industry Relevance**: Essential for API security
   - **License**: MIT License

8. **express-validator (v7.2.1)**
   - **Purpose**: Input validation and sanitization
     * Validates user registration data
     * Ensures proper input format for watch rentals and payments
     * Sanitizes input to prevent injection attacks
     * Provides consistent validation error responses
   - **Industry Relevance**: Common in Express.js applications
   - **License**: MIT License

9. **cors (v2.8.5)**
   - **Purpose**: Cross-Origin Resource Sharing support
     * Configures allowed origins for frontend applications
     * Handles preflight requests for complex operations
     * Enables secure communication between frontend and backend
     * Restricts access from unauthorized domains
   - **Industry Relevance**: Essential for modern web APIs
   - **License**: MIT License

10. **express-async-handler (v1.2.0)**
    - **Purpose**: Simplifies async error handling in Express routes
      * Wraps async controller functions
      * Eliminates need for try/catch blocks in every controller
      * Forwards errors to the global error handler
      * Improves code readability and maintenance
    - **Industry Relevance**: Standard solution for async error handling in Express
    - **License**: MIT License

### Development Dependencies

1. **Jest (v29.7.0)**
   - **Purpose**: Testing framework for unit and integration tests 
     * Runs automated tests for all API endpoints
     * Provides assertion libraries for validation
     * Enables mocking of database and external services
     * Generates test coverage reports
     * Supports isolated test environments
   - **Industry Relevance**: Standard for JavaScript testing
   - **License**: MIT License

2. **Supertest (v7.0.0)**
   - **Purpose**: HTTP assertion library for API testing
     * Simulates HTTP requests to test API endpoints
     * Verifies response status codes and content
     * Tests authentication and authorization flows
     * Validates data manipulation through API
   - **Industry Relevance**: Common for HTTP testing
   - **License**: MIT License

3. **ESLint (v8.57.1)**
   - **Purpose**: Static code analysis and linting
     * Enforces Airbnb JavaScript style guide
     * Catches potential bugs and code quality issues
     * Ensures consistent coding practices across team
     * Integrates with IDE for real-time feedback
   - **Industry Relevance**: Standard for JavaScript linting
   - **License**: MIT License

4. **ESLint Airbnb Configuration (v15.0.0)**
   - **Purpose**: Provides industry-standard code style rules
     * Enforces consistent naming conventions
     * Standardizes code formatting and structure
     * Customized for our database naming conventions
     * Supports modern ECMAScript features
   - **Industry Relevance**: Widely adopted style guide
   - **License**: MIT License

5. **ESLint Import Plugin (v2.31.0)**
   - **Purpose**: Validates module import/export patterns
     * Ensures proper module import organization
     * Prevents circular dependencies
     * Validates import paths
     * Enforces consistent import styles
   - **Industry Relevance**: Essential for modular code organization
   - **License**: MIT License

### Dependency Management

- **Package Manager**: npm
- **Version Control**: Specified in `package.json`
- **Key Scripts**:
  ```json
  "scripts": {
    "start": "NODE_ENV=production node src/index.js",
    "dev": "NODE_ENV=development node --watch src/index.js",
    "test": "jest --runInBand",
    "test:coverage": "jest --coverage"
  }
  ```
- **Note**: The project uses Node.js native `--watch` flag instead of nodemon for development
- **Installation**: `npm install`

## Application Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/luxury-watch-backend.git
cd luxury-watch-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root with the following values:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:5173
```

### 4. Start the Development Server
```bash
npm run dev
```
This starts the backend with **hot-reloading**.

### 5. Running Tests
To execute unit and integration tests:
```bash
npm run test
```

To run a specific test file:
```bash
npx jest src/tests/userController.test.js
```

#### Test Coverage
To generate and view test coverage reports:
```bash
# Generate coverage report
npx jest --coverage

# Generate coverage and open report in browser
npx jest --coverage --coverageReporters="html" && open coverage/index.html
```

### 6. Production Deployment
Deploy using **Render, AWS, or DigitalOcean**:
```bash
npm start
```