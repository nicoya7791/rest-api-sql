const express = require('express');
const router = express.Router();
const { Course, User } = require('./models');


// async handler
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

// get list of Courses
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