const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

app.use(helmet());

// Basic logging for all requests
app.use((req, res, next) => {
  console.log(`📥 Incoming Request: ${req.method} ${req.originalUrl}`);
  console.log("🔹 Headers:", req.headers);
  next();
});

app.use(
  cors({
    origin: "process.env.FRONTEND_ORIGIN",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(["/books", "/authors", "/categories"], express.json());

// JWT Authentication Middleware
function authenticateJWT(req, res, next) {
  console.log(
    " for authorization : checking JWT for:",
    req.method,
    req.originalUrl
  );

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT verification failed:", err.message);
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

function checkRole(serviceName) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(403).json({ error: "Role not foundor not authorised" });
    }
    const role = user.role;

    const roles = {
      admin: {
        books: ["GET", "POST", "PUT", "DELETE"],
        authors: ["GET", "POST", "PUT", "DELETE"],
        categories: ["GET", "POST", "PUT", "DELETE"],
      },
      author: {
        books: ["GET", "POST", "PUT"],
        authors: ["GET"],
        categories: ["GET"],
      },
      user: {
        books: ["GET"],
        authors: ["GET"],
        categories: ["GET"],
      },
    };

    const allowedMethods = roles[role] && roles[role][serviceName];

    if (!allowedMethods || !allowedMethods.includes(req.method)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
}

//signup or login
app.use(
  "/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/auth": "" },
  })
);

app.use(authenticateJWT);

app.post("/books", authenticateJWT, checkRole("books"), async (req, res) => {
  try {
    const response = await fetch(`${process.env.BOOKS_SERVICE_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Failed to post /books:", err);
    res.status(500).json({ error: "Failed to add book" });
  }
});

app.get(
  "/books",
  authenticateJWT,
  checkRole("books"),
  createProxyMiddleware({
    target: process.env.BOOKS_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`➡ Forwarding GET /books to Books Service`);
    },
  })
);

// Authors service
app.use(
  "/authors",
  checkRole("authors"),
  createProxyMiddleware({
    target: process.env.AUTHORS_SERVICE_URL,
    changeOrigin: true,
  })
);

// Categories service
app.use(
  "/categories",
  checkRole("categories"),
  createProxyMiddleware({
    target: process.env.CATEGORIES_SERVICE_URL,
    changeOrigin: true,
  })
);

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
