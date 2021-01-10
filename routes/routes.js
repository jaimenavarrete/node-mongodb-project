const express = require('express');
const router = express.Router();

// Call users controller
const usersController = require('./../controllers/usersController');

module.exports = () => {
    // Home route
    router.get('/', usersController.usersDatatable);

    return router;
}