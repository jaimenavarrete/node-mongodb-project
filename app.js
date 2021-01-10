const express = require('express');
const app = express();
const path = require('path');

// Define the project static files
app.use(express.static('./public'))

// Set PUG as the project view engine
app.set('view engine', 'pug');

// Set views files location
app.set('views', path.join(__dirname, '/views'));

// Get routes
const routes = require('./routes/routes');
app.use('/', routes());


app.listen(3001, () => console.log('Server listen on port 3001'));