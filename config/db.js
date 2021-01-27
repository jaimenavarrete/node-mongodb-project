const mongoose = require('mongoose');

const cluster = process.env.CLUSTER_NAME;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

mongoose.Promise = global.Promise;
mongoose.connect(
    // 'mongodb://localhost:27017/usersDatatable',
    `mongodb+srv://${user}:${pass}@${cluster}.afaje.mongodb.net/${dbName}?retryWrites=true&w=majority`,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

module.exports = mongoose

// const { MongoClient } = require('mongodb');

// // Connection URL
// const url = 'mongodb://localhost:27017';

// // Database Name
// const dbName = 'usersDatatable';

// const openDbConnection = async () => {
//     const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

//     try {
//         // Connect to MongoDB Driver
//         await client.connect();

//         // Select database
//         const db = await client.db(dbName);

//         return db;
//     }
//     catch(err) {
//         throw `Error: ${err}`;
//     }
// }

// module.exports = openDbConnection;