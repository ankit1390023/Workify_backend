import { Router } from 'express';
const router = Router();
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from '../controllers/application.controller.js';
// Uncomment these lines if you have defined the respective controllers
router.route('/applyJob/:id').get(verifyJWT,applyJob);
router.route('/getAppliedJobs').get(verifyJWT, getAppliedJobs);
router.route('/:id/getApplicants').get(verifyJWT, getApplicants);
router.route('/status/:id/update').post(verifyJWT, updateStatus);
export default router;
