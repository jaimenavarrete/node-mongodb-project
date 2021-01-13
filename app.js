const express = require('express');
const cors = require('cors');
const app = express();

// Set variables of the system
app.set('port', process.env.PORT || 3001);

// Middleware for JSON
app.use(express.json());

// Middleware to allow external connections to the API
app.use(cors());

// Get API routes
const routes = require('./routes/routes');
app.use('/api/users', routes());



app.listen(app.get('port'), () => console.log(`Server listen on port ${app.get('port')}`));