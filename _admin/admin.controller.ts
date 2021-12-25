import { NextFunction, Request, Response } from 'express';
import interestModel from './schemas/interest.schema';
import subCat from './schemas/subCategory.schema';
import Category from './schemas/category.schema';

const createCategory = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { name, subCategories } = req.body

        const category = await Category.create({ name })

        res.status(200).json({
            success: true,
            msg: "category Created",
            category
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            msg: "category Creation Error !",
            err
        })
    }
}

const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const category = await Category.find().populate("subCategories")

        res.status(200).json({
            success: true,
            total: category.length,
            categies: category
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            msg: "Error getting all category !"
        })
    }
}

const createSubCategoryByCategoryId = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params
        const { name } = req.body

        // @ts-ignore
        const category = await Category.findOne({_id: id})

        if (!category) {
            return res.status(404).json({
                success: false,
                msg: "category not found !"
            })
        }

        if (!name) {
            return res.status(404).json({
                success: false,
                msg: "subcategory type 'text' is required !"
            })
        }

        const subcategory = await subCat.findOne({ name })

        if (subcategory) {
            return res.status(304).json({
                success: true,
                msg: `sub "${name}" already exist !`
            })
        }

        const newSubcategory = await subCat.create({ name })

        category.subCategories.push(newSubcategory._id)
        await category.save()


        res.status(200).json({
            success: true,
            category
            // msg: "subcategory Created",
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            msg: "subcategory with category id Creation failed !"
        })
    }
}

// const createSubCategory = async (req: Request, res: Response, next: NextFunction) => {

//     try {
//         const { name } = req.body

//         const subcategory = await subCat.create({ name })

//         res.json({
//             success: true,
//             msg: "subcategory Created",
//             subcategory
//         })

//     } catch (err) {
//         console.log(err)
//         res.json({
//             success: false,
//             msg: "subcategory Creation Error !"
//         })
//     }
// }

const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    
    const { id } = req.params 

    try {

        //@ts-ignore
        const category = await Category.findOne({ _id: id }).populate('subCategories')

        if (!category || !id) {
            return res.status(404).json({
                success: false,
                msg: "Category not found !"
            })
        }

        res.status(200).json({
            success: true,
            category
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            msg: "Error getting category !"
        })
    }
}

const getAllSubCategory = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const subcategory = await subCat.find()

        res.json({
            success: true,
            subcategies: subcategory
        })

    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            msg: "Error getting all sub-categories !"
        })
    }
}


const createInterest = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { text, image } = req.body

        await interestModel.create({ text, img: image })

        res.json({
            success: true,
            msg: "interest Created"
        })

    } catch (err) {

        res.json({
            success: false,
            msg: "interest Creation Error !"
        })
    }
}

const getAllInterests = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const interests = await interestModel.find()

        res.json({
            success: true,
            data: interests
        })

    } catch (err) {
        res.json({
            success: false,
            msg: "Error getting all interests"
        })
    }
}



export default {
    createInterest,
    getAllInterests,
    getCategoryById,
    getAllSubCategory,
    createCategory,
    getAllCategory,
    createSubCategoryByCategoryId
}