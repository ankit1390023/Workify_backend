import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getUserStats, getApplicationTrends, getUserSkills, getGlobalStats } from '../controllers/dashboard.controller.js';

const router = Router();

// Protected routes
router.route('/stats').get(verifyJWT, getUserStats);
router.route('/trends').get(verifyJWT, getApplicationTrends);
router.route('/skills').get(verifyJWT, getUserSkills);
router.route('/global-stats').get(verifyJWT, getGlobalStats);

export default router; 