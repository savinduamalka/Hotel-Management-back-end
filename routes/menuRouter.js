import express from 'express';
import { addMenuData, getAllMenu, getHotMenu } from '../controllers/menuController.js';

const menuRouter = express.Router();

// Admin only bulk upsert
menuRouter.post('/bulk', addMenuData);
// Public
menuRouter.get('/', getAllMenu);
menuRouter.get('/hot', getHotMenu);

export default menuRouter;
