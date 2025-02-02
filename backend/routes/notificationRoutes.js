import express from 'express'
import protectedRoute from '../middlewear/protectedRoute.js';
import { deleteNotifications, getNotifications } from '../controllers/notificationController.js';

const router = express.Router();

router.get("/", protectedRoute, getNotifications);
router.delete("/:id", protectedRoute, deleteNotifications);



export default router