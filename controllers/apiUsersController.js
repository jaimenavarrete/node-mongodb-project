const openDbConnection = require('./../config/db');

exports.showAllUsers = async () => {
    const db = await openDbConnection();

    const collection = await db.collection('users');

    const users = await collection.find().toArray();

    return users;
}