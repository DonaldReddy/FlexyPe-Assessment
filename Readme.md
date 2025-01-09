## Installation

To install FlexyPe, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/DonaldReddy/FlexyPe-Assessment.git
   ```
2. Navigate to the project directory:
   ```bash
   cd FlexyPe-Assessment
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

provide all the environmental variable mentioned in the `.env.dev` file.

# Need MongoDB and Redis installed locally or remotely hosted.

To start the server, run the following command:

```bash
npm run start
```

## Endpoints

```bash
GET :-  /api/login

returns a new JWT token.
```

```bash
POST :-  /api/submit

submits.
```

```bash
GET :-  /api/metrics

returns different metrics about failed requests.
```

# Middlewares 👇

## 1) headerValidator

Validates headers in the request.

## 2) verifyToken

Verifies the JWT Token in the headers.

## 3) rateLimit

Rate limits the request based on IP addresses.

```
💡  /api/login endpoint doesn't have verifyToken middleware.
```

# Scalability 🚀

Used redis for rate limiting the requests and for implementing the mail queue which works well with distributed systems, and mongodb for storing the failed requests with indexing for metrics analysis.
