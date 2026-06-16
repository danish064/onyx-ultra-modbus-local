import { Router } from 'express';
import metricsRoutes from './metricsRoutes.js';
import settingsRoutes from './settingsRoutes.js';

const router = Router();

router.use('/metrics', metricsRoutes);
router.use('/settings', settingsRoutes);

export default router;
