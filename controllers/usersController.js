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

exports.createUser = async (req, res) => {
    const { status, country, company, nombre, email } = req.body

    if(status !== '#' && country !== '#' && company !== '' && nombre !== '' && email !== '') {
        const doc = new User({
            status,
            country,
            company,
            nombre,
            email
        });

        await doc.save();

        res.send({
            title: "Success",
            text: "User created successfully",
            icon: "success"
        });
    }
    else {
        res.send({
            title: "Error",
            text: "The user couldn't be created. You must fill all the fields",
            icon: "error"
        });
    }
}

exports.editUser = async (req, res) => {
    const { status, country, company, nombre, email } = req.body

    if(status && status !== '#' && country && country !== '#' && company !== '' && nombre !== '' && email !== '') {
        const findUser = await User.findById(req.body._id);

        await User.updateOne(findUser, req.body);

        res.send({
            title: "Success",
            text: "User edited successfully",
            icon: "success"
        });
    }
    else {
        res.send({
            title: "Error",
            text: "The user couldn't be edited. You must fill all the fields",
            icon: "error"
        });
    }
}

exports.deleteUser = (req, res) => {
    const users = Object.values(req.body)

    users.forEach(async user => {
        await User.findOneAndDelete(user);
    })

    res.send("User/s deleted successfully");
}