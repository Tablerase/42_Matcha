import express, { Router } from 'express';
import { getUsers, getUserById, createUser } from '@views/userViews';

const router: Router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);

export default router;