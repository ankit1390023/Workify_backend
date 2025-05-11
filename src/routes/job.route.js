import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getAllJobs, getJobById, getJobsByAdmin, postJob, updateJob } from '../controllers/job.controller.js';
const router = Router();
// Route to handle job posting, requiring JWT verification
router.route('/post').post(verifyJWT, postJob);
router.route('/allJobs').get(getAllJobs);
router.route('/getJobById/:id').get(getJobById);
router.route('/getJobByAdmin').get(verifyJWT, getJobsByAdmin);
router.route('/update/:id').post(verifyJWT, updateJob);

export default router;
