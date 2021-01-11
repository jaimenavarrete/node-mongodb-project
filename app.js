const express = require('express');
const app = express();
const path = require('path');

// Set variables of the system
app.set('port', process.env.PORT || 3001);

// Middleware for JSON
app.use(express.json());

// Define the project static files
app.use(express.static('./public'));

// Set PUG as the project view engine
app.set('view engine', 'pug');

// Set views files location
app.set('views', path.join(__dirname, '/views'));

// Get APP routes
const routes = require('./routes/routes');
app.use('/', routes());

// Get API routes
const apiUserRoutes = require('./routes/users.routes');
app.use('/api/users', apiUserRoutes());



app.listen(3001, () => console.log('Server listen on port 3001'));