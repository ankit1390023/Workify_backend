import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { getUserStats, getApplicationTrends, getUserSkills, getGlobalStats } from '../controllers/dashboard.controller.js';

const router = Router();

// Protected routes
router.route('/stats').get(verifyJwt, getUserStats);
router.route('/trends').get(verifyJwt, getApplicationTrends);
router.route('/skills').get(verifyJwt, getUserSkills);
router.route('/global-stats').get(verifyJwt, getGlobalStats);

export default router; 