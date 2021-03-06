const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

//connect the database
connectDB();

// middleware
app.use(express.json({ extended: false }));
app.use(cors());

app.get('/', res =>
  res.json({
    msg: 'Welcome to the Contact API, this is a simplistic api boilerplate'
  })
);

//routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/email', require('./routes/email'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/comments', require('./routes/comments'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on ${PORT}`));
