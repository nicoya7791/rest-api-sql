'use strict';

const express = require('express');
const router = express.Router();
const { Course, User } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');


/**
 * Try catch handler
 * @param callback
 * @returns async function
 */

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

// =================================
//  USER ROUTES
// ==================================
/**
 * @returns { user }. Authenticated user.
 */
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    //asign currentUser property to req.
    const user = req.currentUser;
    if (user) {
        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress
        });
    } else {
        res.json({ error: 'user not found' })
    }


}));

/**
 * @returns. create a new user
 */
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.location('/')
            .status(201)
            .json({ "message": "User successfully created!" })
            .end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// =================================
//  COURSES ROUTES
// ==================================


/**
 * @returns {courses, user}. list of courses
 */
router.get('/courses', asyncHandler(async (req, res, next) => {
    const courseData = await Course.findAll({
        include: [{
            model: User,
        }]
    });
    if (courseData) {
        res.status(200).json({ courseData });
    } else {
        const error = new Error('Courses not found!')
        error.status = 404;
        next(error);

    }
}));


module.exports = router;