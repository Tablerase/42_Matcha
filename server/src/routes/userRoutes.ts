import express, { Router } from 'express';
import { getUsers, getUserById } from '@models/userModel';

const router: Router = express.Router();

// TODO: shall be updated to use services ?
router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;