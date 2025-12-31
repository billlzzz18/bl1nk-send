# bl1nk-send

A modern, efficient, and secure file transfer application designed for seamless sharing of files across different devices and users.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployment Instructions](#deployment-instructions)
- [Contributing Guidelines](#contributing-guidelines)
- [License](#license)

## Features

- **Fast File Transfer**: Optimized for quick and reliable file transfers
- **Secure Sharing**: Built-in security measures to protect your files
- **Cross-Platform Support**: Works seamlessly on multiple operating systems
- **User-Friendly Interface**: Intuitive design for easy file sharing
- **Real-time Progress**: Monitor transfer progress in real-time
- **Multiple File Support**: Transfer single or multiple files simultaneously
- **Lightweight**: Minimal resource footprint for better performance
- **No Account Required**: Simple sharing without complex authentication (optional)

## Project Structure

```
bl1nk-send/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Application pages/routes
│   ├── services/           # Business logic and API services
│   ├── utils/              # Utility functions and helpers
│   ├── styles/             # Stylesheets and theme configuration
│   └── App.tsx             # Main application component
├── public/                 # Static assets
├── tests/                  # Unit and integration tests
├── docs/                   # Additional documentation
├── .github/
│   └── workflows/          # CI/CD pipeline configurations
├── package.json            # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── README.md              # This file
└── .gitignore             # Git ignore rules
```

## Tech Stack

### Frontend
- **React** - UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript for better code quality
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for API development
- **WebSocket** - Real-time bidirectional communication

### Database & Storage
- **MongoDB** - NoSQL database for metadata storage
- **File System Storage** - Local or cloud-based file storage

### Development & Testing
- **Jest** - Testing framework
- **Vitest** - Unit test framework
- **ESLint** - Code quality and linting
- **Prettier** - Code formatting

### DevOps & Deployment
- **Docker** - Containerization
- **GitHub Actions** - CI/CD automation
- **Nginx** - Web server and reverse proxy

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.0.0 or higher)
- npm or yarn package manager
- Git
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/billlzzz18/bl1nk-send.git
   cd bl1nk-send
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure the following variables in `.env.local`:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   VITE_APP_NAME=bl1nk-send
   VITE_MAX_FILE_SIZE=5368709120
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:5173`

### Backend Setup

1. **Navigate to the backend directory** (if separate)
   ```bash
   cd server
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Set up:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/blinkend
   JWT_SECRET=your_jwt_secret_key
   MAX_FILE_SIZE=5368709120
   UPLOAD_DIR=./uploads
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Build for Production

```bash
# Build frontend
npm run build

# Backend build (if applicable)
npm run build:server
```

## Deployment Instructions

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t bl1nk-send:latest .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 -p 5173:5173 \
     -e MONGODB_URI=mongodb://mongo:27017/blinkend \
     -e NODE_ENV=production \
     bl1nk-send:latest
   ```

3. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Manual Deployment

1. **Prepare the server**
   - SSH into your server
   - Install Node.js and npm
   - Install Nginx and configure as reverse proxy

2. **Clone and setup**
   ```bash
   git clone https://github.com/billlzzz18/bl1nk-send.git
   cd bl1nk-send
   npm install
   npm run build
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Start the application**
   ```bash
   npm run start
   ```

### Cloud Deployment (Vercel, Heroku, AWS)

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Heroku:**
```bash
heroku login
heroku create bl1nk-send
git push heroku main
```

**AWS:**
- Use AWS Elastic Beanstalk or EC2
- Configure RDS for MongoDB (or use MongoDB Atlas)
- Set up S3 for file storage
- Use CloudFront for CDN

### SSL/TLS Certificate

```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --standalone -d yourdomain.com
```

## Contributing Guidelines

We welcome contributions to bl1nk-send! Please follow these guidelines to ensure smooth collaboration.

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Report security issues responsibly

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/bl1nk-send.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-number
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write clear, descriptive commit messages
   - Add or update tests as necessary

4. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature" -m "Description of changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Submit a Pull Request**
   - Provide a clear title and description
   - Reference any related issues (#issue-number)
   - Ensure all tests pass
   - Request review from maintainers

### Commit Message Convention

Use conventional commits format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Test additions or modifications
- `chore`: Build, dependency, or tooling changes

**Example:**
```
feat(upload): add drag-and-drop file upload

Implement drag-and-drop functionality on the main upload area
to improve user experience and allow easier file selection.

Closes #42
```

### Coding Standards

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful variable and function names
- Add JSDoc comments for complex functions
- Maintain test coverage above 80%

### Pull Request Process

1. Update the README.md if needed
2. Update the CHANGELOG.md
3. Ensure all tests pass: `npm run test`
4. Ensure code is formatted: `npm run format`
5. Ensure linting passes: `npm run lint`
6. Request review from at least one maintainer
7. Address any feedback or requested changes

### Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Include a clear title and description
- Provide steps to reproduce for bugs
- Include relevant system information
- Attach screenshots or logs if applicable

### Development Workflow

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Build for production
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Made with ❤️ by [billlzzz18](https://github.com/billlzzz18)**

For more information, visit our [GitHub repository](https://github.com/billlzzz18/bl1nk-send) or open an issue for questions and support.
