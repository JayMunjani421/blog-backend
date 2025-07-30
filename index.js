const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// app.use(cors());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://blog-frontend-phi-swart.vercel.app'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);
const blogRoutes = require('./routes/blogRoutes');
app.use('/api/blog', blogRoutes);
const commentRoutes = require('./routes/commentRoutes');
app.use('/api/comment', commentRoutes);
const likeRoutes = require('./routes/likeRoutes');
app.use('/api/like', likeRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`));
