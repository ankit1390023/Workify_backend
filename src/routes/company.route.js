import { Router } from 'express';
const router = Router();
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { getCompany, getCompanyById, registerCompany, updateCompany } from '../controllers/company.controller.js';
// Uncomment these lines if you have defined the respective controllers
router.route('/register').post(verifyJWT, registerCompany);
router.route('/get').get(verifyJWT, getCompany);
router.route('/get/:id').get(verifyJWT, getCompanyById);
router.route('/update/:id').put(upload.fields([{ name: 'logo', maxCount: 1 }]), updateCompany);
export default router;
