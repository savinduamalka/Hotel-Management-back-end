import express from 'express';
import { addMenuData } from '../controllers/menuController.js';

const menuRouter = express.Router();


menuRouter.post('/bulk', addMenuData);


export default menuRouter;
