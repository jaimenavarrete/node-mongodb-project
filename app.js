const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// MongoDB Connection with mongoose
const mongoose = require('./config/db');
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// Set variables of the system
app.set('port', process.env.PORT || 3001);

// Allows bodyParser to read de form data
app.use(bodyParser.urlencoded({extended: true}));

// Middleware for JSON
app.use(bodyParser.json());

// Middleware to allow external connections to the API
// app.use(cors());

// Get API routes
const routes = require('./routes/routes');
app.use('/api/users', routes());



app.listen(app.get('port'), () => console.log(`Server listen on port ${app.get('port')}`));