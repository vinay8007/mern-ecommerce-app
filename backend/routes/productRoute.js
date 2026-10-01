import express from 'express'
import {listProducts, addProduct, updateProduct, removeProduct, singleProduct, seedProducts } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]), addProduct);
productRouter.put('/update', adminAuth, updateProduct);
productRouter.post('/remove',adminAuth,removeProduct);
productRouter.post('/single',singleProduct);
// productRouter.post('/list',listProducts);
productRouter.get('/list',listProducts);
productRouter.post('/seed', adminAuth,seedProducts)


export default productRouter;