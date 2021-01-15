const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

// Import api users controller
const usersController = require('../controllers/usersController');

const whiteList = [
    'http://localhost:8080',
    'http://127.0.0.1:5500'
];

const corsOptions = {
    origin: function(origin, callback) {
        if(whiteList.indexOf(origin) !== -1) {
            callback(null, true)
        }
        else {
            callback(new Error('Not Allowed by CORS'))
        }
    }
}

module.exports = () => {
    router.get('/', cors(corsOptions), async (req, res) => {
        const users = await usersController.showAllUsers();
        res.json(users);
    });

    router.post('/', cors(corsOptions), upload.none(), (req, res) => {
        // console.log(req.body)
        res.send('User succesfully added')
    });

    return router;
}