import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { getAllJobs, getJobById, getJobsByAdmin, postJob } from '../controllers/job.controller.js';
const router = Router();
// Route to handle job posting, requiring JWT verification
router.route('/post').post(verifyJwt, postJob);
router.route('/allJobs').get(getAllJobs);
router.route('/getJobById/:id').get(getJobById);
<<<<<<< HEAD
router.route('/getJobByAdmin').get(verifyJwt,getJobsByAdmin);
=======
router.route('/getJobByAdmin').get(getJobsByAdmin);
>>>>>>> a6f537e759bf380ff8afb8ea2e5b47fb326e6092
export default router;
