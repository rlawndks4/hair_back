import express from 'express';
import userRoutes from './user.route.js';
import authRoutes from './auth.route.js';
import uploadRoutes from './upload.route.js';
import pointRoutes from './point.route.js';
import postRoutes from './post.route.js';
import reservationRoute from './reservation.route.js';
import shopRoute from './shop.route.js';
import alarmRoute from './alarm.route.js';


const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */

// tables
router.use('/users', userRoutes);
router.use('/points', pointRoutes);
router.use('/posts', postRoutes);
router.use('/reservations', reservationRoute);
router.use('/shops', shopRoute);
router.use('/alarms', alarmRoute);

//auth
router.use('/auth', authRoutes);

//util
router.use('/upload', uploadRoutes);



export default router;
