const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy /books to books-service
app.use('/books', createProxyMiddleware({
  target: 'http://localhost:3001', // URL where your books-service runs
  changeOrigin: true,
  pathRewrite: { '^/books': '' }
}));

// Proxy /authors to authors-service
app.use('/authors', createProxyMiddleware({
  target: 'http://localhost:3002', // URL where your authors-service runs
  changeOrigin: true,
  pathRewrite: { '^/authors': '' }
}));

// Proxy /categories to categories-service
app.use('/categories', createProxyMiddleware({
  target: 'http://localhost:3003', // URL where your categories-service runs
  changeOrigin: true,
  pathRewrite: { '^/categories': '' }
}));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
