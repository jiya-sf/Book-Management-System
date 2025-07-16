import express from 'express';
import booksRouter from './routes/book.routes';
import {sequelize } from './models';

const app=express();
const PORT=5000;
app.use(express.json());
app.use('/api/books',booksRouter);

sequelize.sync({alter:true}).then(() => {
  console.log('Database synced');

  app.listen(PORT,() => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}).catch((err)=> {
  console.error('DB sync failed:', err);
});
