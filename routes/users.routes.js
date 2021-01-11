const express = require('express');
const router = express.Router();

// Import api users controller
const apiUsersController = require('./../controllers/apiUsersController');

module.exports = () => {
    router.get('/', async (req, res) => {
        const users = await apiUsersController.showAllUsers();
        res.json(users);
    });

    return router;
}