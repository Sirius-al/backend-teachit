import express from 'express';
import adminController from './admin.controller';

const authRouter = express.Router();

// ---> Everything that an Admin has the right to do will be in this Routers


//? Route:    GET => /data/get-interests
//? Desc:     Get All Interest
//? access:   Private ( Restricted to admin )
authRouter.route('/get-interests').get(adminController.getAllInterests)

//? Route:    GET => /data/get-subcategory
//? Desc:     Get All subcategory
//? access:   Private ( Restricted to admin )
authRouter.route('/get-subcategories').get(adminController.getAllSubCategory)

//? Route:    GET => /data/get-category/:id
//? Desc:     Get All category
//? access:   Private ( Restricted to admin )
authRouter.route('/get-category/:id').get(adminController.getCategoryById)

//? Route:    GET => /data/get-category
//? Desc:     Get All category
//? access:   Private ( Restricted to admin )
authRouter.route('/get-categories').get(adminController.getAllCategory)

//? Route:    POST => /data/create-category/:id
//? Desc:     create sub-category by category ID
//? access:   Private ( Restricted to admin )
authRouter.route('/create-subcategory/:id').post(adminController.createSubCategoryByCategoryId)


//? Route:    POST => /data/create-interest
//? Desc:     create an Interest
//? access:   Private ( Restricted to admin )
authRouter.route('/create-interest').post(adminController.createInterest)

//? Route:    POST => /data/create-subcategory
//? Desc:     create course's sub-category
//? access:   Private ( Restricted to admin )
// authRouter.route('/create-subcategory').post(adminController.createSubCategory)

//? Route:    POST => /data/create-category
//? Desc:     create course's category
//? access:   Private ( Restricted to admin )
authRouter.route('/create-category').post(adminController.createCategory)



export default authRouter;