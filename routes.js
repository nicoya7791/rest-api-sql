'use strict';

const express = require('express');
const router = express.Router();
const { Course, User } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');
const { restart } = require('nodemon');


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

// **********************************
//  USER ROUTES BEGIN
// **********************************
/**
 * @returns { user }. currentUser Value is pass from authenticateUser middleware.
 */
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
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
            .status(201).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// **********************************
//  USER ROUTES END
// *********************************
/**


// ********************************
//  COURSES ROUTES BEGIN
// ******************************


/**
 * @returns {courses, user}. list of courses
 */
router.get('/courses', asyncHandler(async (req, res, next) => {
    const courseData = await Course.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
            model: User,
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
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

/**
 *  Get indiviudal course by id to include the user. If id not found displays error.
 */

router.get('/courses/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByPk(id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
            model: User,
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        }]
    });
    course ? res.json(course) : res.status(404).json({ 'Error': `Course id: ${id} does not exist` });
}));

/**
 *  Create new course with request body then set location to new created course.
 */
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const user = req.currentUser;
        if (user) {
            const course = await Course.create(req.body);
            res.location(`/courses/${course.id}`).status(201).end();
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }

}));

/**
 *  Update course using request body
 */
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const user = req.currentUser;
        if (user) {
            const course = await Course.findByPk(req.params.id);
            if (course) {
                if (course.userId == user.id) {
                    req.body.userId = user.id;
                    await course.update(req.body);
                    res.status(204).end();
                } else {
                    res.status(403).json({ message: `You are not autorize  to access course id: ${course.id}` });
                }

            } else {
                res.status(404).json({ 'Error': `Course does not exist` });
            }
        } else {
            res.status(401).json({ message: 'User does not exist' });
        }

    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }


}));

/**
 *  Delete course 
 */
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if (course.userId == user.id) {
        await course.destroy();
        res.status(204).end();
    } else {
        res.status(403).json({ error: `You dont have access to course id: ${course.id}` })
    }

}));
module.exports = router;