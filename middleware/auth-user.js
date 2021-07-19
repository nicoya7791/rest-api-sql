'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Authenticate the request using Basic Authentication.
/**
 *  email and password get assgined to credentials.
 *  find user with those credentials and compare to be a match
 *  if credential are a match with user info in database, assign user info to currentUser variable.
 */


exports.authenticateUser = async (req, res, next) => {
    let message;
    const credentials = auth(req); // => { name: 'something', pass: 'whatever' }

    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name } });

        if (user) {
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
            if (authenticated) {
                console.log(`Authentication successful for username: ${user.emailAddress}`);

                // Store the user on the Request object.
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for username: ${credentials.emailAddress}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};
