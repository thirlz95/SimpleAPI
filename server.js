const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

//connect the database
connectDB();

// middleware
app.use(express.json({ extended: false }));
app.use(cors());

app.get('/', (req, res) =>
  res.json({
    msg: 'Welcome to the Contact API, this is a simplistic api boilerplate'
  })
);

//routes
const users = app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/email', require('./routes/email'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on ${PORT}`));
