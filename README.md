# InvoiceGlide

A full-stack invoice management system built with microservices architecture, featuring JWT authentication, subscription management, and automated email notifications.

🌐 **Live Demo:** [www.invoiceglide.com](https://www.invoiceglide.com)

## Architecture

**Microservices Backend:**
- **Admin Service** - User authentication and JWT token management
- **Invoice Service** - Invoice and client CRUD operations
- **Mailing Service** - Email templates, automated reminders, and invoice delivery
- **Caddy Proxy** - API gateway with CORS handling

**Frontend:**
- Angular 16 SPA with responsive design

**Database:**
- PostgreSQL 15

**Deployment:**
- Dockerized microservices with Docker Compose
- AWS CloudFormation templates included

## Key Features

- User registration and authentication with JWT (access + refresh tokens)
- Invoice creation with line items and PDF export
- Client management
- Customizable invoice templates (colors, logo, branding)
- Automated payment reminder emails
- Dashboard with analytics and charts

## Technology Stack

**Backend:**
- Java 17, Spring Boot 3.3.3, Spring Security
- Spring Data JPA with Hibernate
- PostgreSQL, Maven
- JWT for authentication
- OpenAPI/Swagger for API documentation

**Frontend:**
- Angular 16, TypeScript, Tailwind CSS
- Chart.js for visualization
- jsPDF for PDF generation

**Infrastructure:**
- Docker & Docker Compose
- Caddy reverse proxy
- AWS deployment ready

## Authentication Flow

1. **Registration**: User signs up → email confirmation sent
2. **Login**: Credentials verified → JWT access token (1h) + refresh token (24h) issued
3. **Authorization**: Protected endpoints validate JWT via Spring Security filters
4. **Token Refresh**: Expired access tokens refreshed using refresh token
5. **Password Reset**: Email-based password reset flow

JWT tokens contain user ID and role claims, enabling stateless authentication across microservices.

## Quick Start

```bash
# Clone and navigate
git clone <repository-url>
cd invoiceGlide-main/backend

# Start all services
docker-compose up --build

# In separate terminal, start frontend
cd ../frontend
npm install && npm start
```

Access the app at `http://localhost:4200`

## Project Structure

```
├── backend/
│   ├── admin-service/       # Auth, users
│   ├── invoice-service/     # Invoices, clients
│   ├── mailing-service/     # Emails, templates, reminders
│   ├── caddy-proxy/         # Reverse proxy
│   └── docker-compose.yml
└── frontend/                # Angular app
```

## Environment Variables

Key configuration in `.env`:
```env
DB_URL=jdbc:postgresql://postgres:5432/invoicedb
JWT_SECRET=your-secret-key-256-bits
JWT_ACCESS_TTL=3600000
JWT_REFRESH_TTL=86400000
MAILTRAP_API_TOKEN=your-mailtrap-token
```
