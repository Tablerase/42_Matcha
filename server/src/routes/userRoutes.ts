import express, { Router } from 'express';
import { getUsers, getUserById } from '@controllers/userController';

const router: Router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;