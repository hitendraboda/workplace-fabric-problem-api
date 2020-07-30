const mongoose = require('mongoose');
const UserModel = require('./users/models/users.model');
const crypto = require('crypto');

require('custom-env').env(process.env.NODE_ENV);

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => {
    console.log('✅  MongoDB is connected.')
});

let salt = crypto.randomBytes(16).toString('base64');
let hash = crypto.createHmac('sha512', salt).update('demo').digest("base64");

let body = {
    firstName: "Demo",
    lastName: "User",
    email: "demo@demo.com",
    password: salt + "$" + hash,
    role: 'ADMIN'
};

UserModel.createUser(body);
console.log('✅  User created successfully');
