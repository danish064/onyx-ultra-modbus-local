import { Router } from 'express';
import { updateSetting } from '../controllers/settingsController.js';

const router = Router();

router.post('/', updateSetting);

export default router;
