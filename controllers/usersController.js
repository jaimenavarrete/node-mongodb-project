const mongoose = require('mongoose');
const User = require('./../models/Users');

exports.showAllUsers = async (req, res) => {
    let users = [];

    await User.find({}, (err, docs) => {
        if(err) throw new Error(err)

        docs.forEach(doc => {
            users = [...users, doc]
        });
    });

    res.send(users);
}

exports.createUser = (req, res) => {
    // console.log(req.body);
    res.send('User succesfully added');
}