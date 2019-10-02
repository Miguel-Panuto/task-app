// CRUD create read update delete

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; // Connect to the database

const connectURL = 'mongodb://127.0.0.1:27017'; // The ip adrress to connection
const databaseName = 'task-manager';

MongoClient.connect(connectURL, { useNewUrlParser: true }, (error, client) =>
{
    if (error && !client)
    {
        return console.log('Unable to connect to database!');
    }

    console.log('Connection success');
});