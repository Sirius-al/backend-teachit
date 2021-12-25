//@ts-nocheck

import { Request, Response, NextFunction } from "express";
import Course from './schemas/course.schema'

const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await Course.find()
        .populate({
            path: 'category',
            select: 'name'
        })
        .populate({
            path: 'subcategories',
        })

        res.status(200).json({ success: true, total: courses.length, courses})
        

    } catch (err) {
        console.log(`getAllCourses MW ${err}`)
        res.status(500).json({ success: false, msg: "something went wrong !" })
    }
}

const CreateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        const { title, category, subCategories, coverPhoto, description } = req.body

        const obj = {
            createdBy: user._id
        }

        // if (!title) {
        //    return res.status(400).json({ success: false, msg: 'course title is required !' })
        // }

        // if (!category || subCategories.length === 0) {
        //    return res.status(400).json({ success: false, msg: 'category and subCategories are required !' })
        // }

        const newLesson = {
            videos: [
                {
                    title: '',
                    description: '',
                    source: '',
                    link: ''
                }
            ],
        
            materials: [
                {
                    title: '',
                    description: '',
                    source: '',
                    link: ''
                }
            ],
            
            quiz: {
                mainDescription: "",
                quizes: [
                    {
                        "questions": [ "" ]
                    }
                ]
            },
        
            projectsAndAssignments: {
                mainDescription: "",
                projects: [
                    {
                        title: '',
                        description: '',
                        source: '',
                        link: ''
                    }
                ]
            }
        }


        const course = await Course.create(obj)
        course.lessons.push(newLesson)

        await course.save()
        
        res.status(201).json({ success: true, course: course._id })
    } catch (err) {
        console.log(`CreateCourse MW ${err}`)
        res.status(500).json({ success: false, msg: 'create Course error' })
    }
}

const EditCourseFirstSection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, instructors, regularPrice, salesPrice, subCategories, coverPhoto, category, certificate } = req.body

        const course = await Course.findById(id)

        //* validations
        if (!course) {
            return res.status(400).json({ success: false, msg: 'course not found !' })
        }


        if (parseInt(salesPrice) > parseInt(regularPrice)) {
          return res.status(400).json({ success: false, msg: 'sales price should be less than or equals to regular price'})
        }

        //* value setups
        const insts = instructors.map(inst => {
            return { email: inst }
        })
        
        
        course.title = title ? title : course.title;
        course.instructors = instructors?.length ? [...course.instructors, ...insts] : course.instructors;
        course.price.regular = regularPrice ? regularPrice : course.price.regular;
        course.price.sales = salesPrice ? {...course.price.sales, sales: true, price: salesPrice} : course.price.sales;
        course.subCategories = subCategories && subCategories.length ? subCategories : course.subCategories;
        course.category = category ? category : course.category;
        course.coverPhoto = coverPhoto ? coverPhoto : course.coverPhoto;
        course.certification = certificate ? {...course.certification, has: certificate} : {...course.certification, has: false};

        await course.save()

        const updatedCourse = await Course.findById(id)
        .populate({
            path: 'category',
            select: 'name'
        })
        .populate({
            path: 'subCategories',
        })
        .populate({
            path: 'createdBy',
            select: 'fullName email'
        })
        
        res.status(200).json({ success: true, course: updatedCourse })
    } catch (err) {
        console.log(`EditCourseFirstSection MW ${err}`)
        res.status(500).json({ success: false, msg: 'update Course error' })
    }
}

const EditCourseSecondSection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { description, topics, tags } = req.body;

        const course = await Course.findById(id)

        if (!course) {
            return res.status(400).json({ success: false, msg: 'course not found !' })
        }

        course.description = description.toString();
        course.topics = topics ? topics : [];
        course.tags = tags ? tags : [];


        await course.save()
        
        res.status(200).json({ success: true, course })
    } catch (err) {
        console.log(`EditCourseSecondSection MW ${err}`)
        res.status(500).json({ success: false, msg: 'update Course error' })
    }
}

const createOrUpdateLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, lessonId } = req.params;
        const { videos, materials, quiz, projectsAndAssignments } = req.body;

        const course = await Course.findById(courseId)
        .populate({
            path: 'category',
            select: 'name'
        })
        .populate({
            path: 'subCategories',
        })
        .populate({
            path: 'createdBy',
            select: 'fullName email'
        })

        if (!course) {
            return res.status(400).json({ success: false, msg: 'course not found !' })
        }


        //! ****************************** if there is a lesson id provided 
        // if (lessonId) {
        //     try {
        //         const theLesson = course.lessons.filter(lesson => lesson._id == lessonId)[0]

        //         if (theLesson.length < 1) {
        //             return res.status(422).json({ success: true, msg: 'lesson does not exist !' })
        //         } 

        //         //* adding a video object on a particular lesson
        //         videos && videos.map(vid => theLesson.videos.push(vid))

        //         //* adding a material object on a particular lesson
        //         materials && materials.map(mat => theLesson.materials.push(mat))


        //         //* adding a quiz object on a particular lesson
        //         quiz?.mainDescription ? theLesson.quiz.mainDescription = quiz.mainDescription : theLesson.quiz.mainDescription = "";
        //         quiz?.quizes?.length ? theLesson.quiz.quizes = quiz.quizes : theLesson.quiz.quizes = theLesson.quiz.quizes;
                
                
        //         //* adding a projects and Assignments object on a particular lesson
        //         projectsAndAssignments?.mainDescription ? 
        //             theLesson.projectsAndAssignments.mainDescription = projectsAndAssignments.mainDescription : 
        //             theLesson.projectsAndAssignments.mainDescription = "";

        //         projectsAndAssignments.projects && projectsAndAssignments.projects.length ? 
        //             theLesson.projectsAndAssignments.projects = projectsAndAssignments.projects :
        //             theLesson.projectsAndAssignments.projects = theLesson.projectsAndAssignments.projects;
                    

                
        //         await course.save()
        //         return res.status(200).json({ success: true, course })
        //     } catch (err) {
        //         console.log(err)
        //         return res.status(400).json({ success: true, msg: 'lesson not found' })
        //     }
        // }

        course.lessons[course.lessons.length] = 
            { 
                videos: videos, 
                materials: materials, 
                quiz: quiz, 
                projectsAndAssignments: projectsAndAssignments 
            };

        // materials && (course.lessons[course.lessons.length] = { materials: materials });


        await course.save()
        
        res.status(200).json({ success: true, course })
    } catch (err) {
        console.log(`createOrUpdateLesson MW ${err}`)
        res.status(500).json({ success: false, msg: 'create or update course lesson error' })
    }

}

const deleteQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, lessonId, quizId } = req.params;
        
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(400).json({ success: false, msg: 'course not found !' })
        }
        
        const theLesson = course.lessons.filter(lesson => lesson._id == lessonId)[0]
        const theQuizes = theLesson.quiz.filter(q => q._id != quizId)

        theLesson.quiz = theQuizes;

        await course.save()

        res.status(200).json({ success: true, course, msg: 'the quiz has been deleted !' })
    } catch (err) {
        console.log(`deleteQuiz MW ${err}`)
        res.status(500).json({ success: false, msg: 'delete Course quiz error' })
    }
}

const updateQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, lessonId } = req.params;
        const { mainDescription, quizes } = req.body;
        
        const course = await Course.findById(courseId)
        .populate({
            path: 'category',
            select: 'name'
        })
        .populate({
            path: 'subCategories',
        })
        .populate({
            path: 'createdBy',
            select: 'fullName email'
        })

        if (!course) {
            return res.status(400).json({ success: false, msg: 'course not found !' })
        }
        
        const theLesson = course.lessons.filter(lesson => lesson._id == lessonId)[0]

        mainDescription != theLesson.quiz.mainDescription ? theLesson.quiz.mainDescription = mainDescription : null

        console.log('theLesson => ', theLesson)
        console.log('quizes => ', req.body)

        const non_created_quizes = quizes.filter(q => !q._id)
        const existing_quizes = quizes.filter(q => q._id)

        const createNewQuizes = () => {
            non_created_quizes.forEach((quiz) => {
                theLesson.quiz.quizes.push(quiz)
            })
        }

        const updateExistingProjects = () => {
            //* for every existing quizes we are looping over, and finding quiz item matching the _id and updating the project data
            existing_quizes.forEach((quiz) => {
                const theQuiz = theLesson.quiz.quizes.filter(q => q._id == quiz._id)[0]
                
                const { questions } = quiz;

                theQuiz.questions.length != questions.length ? theQuiz.questions = questions : null

            })
        }

        non_created_quizes.length && createNewQuizes()
        existing_quizes && updateExistingProjects()

        await course.save()

        res.status(200).json({ success: true, course, msg: 'Quizes has been updated !' })
    } catch (err) {
        console.log(`updateQuiz MW ${err}`)
        res.status(500).json({ success: false, msg: 'update Course Quiz quiz error' })
    }
}

const deleteMaterial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, lessonId, materialId } = req.params;
        
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(400).json({ success: false, msg: 'course not found !' })
        }
        
        const theLesson = course.lessons.filter(lesson => lesson._id == lessonId)[0]
        const theMaterials = theLesson.materials.filter(mat => mat._id != materialId)

        theLesson.materials = theMaterials;

        await course.save()

        res.status(200).json({ success: true, course, msg: 'the material has been deleted !' })
    } catch (err) {
        console.log(`deleteMaterials MW ${err}`)
        res.status(500).json({ success: false, msg: 'delete course Material error' })
    }
}

const updateMaterial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, lessonId } = req.params;

        const course = await Course.findById(courseId)
        .populate({
            path: 'category',
            select: 'name'
        })
        .populate({
            path: 'subCategories',
        })
        .populate({
            path: 'createdBy',
            select: 'fullName email'
        })

        if (!course) {
            return res.status(400).json({ success: false, msg: 'course not found !' })
        }
        
        const theLesson = course.lessons.filter(lesson => lesson._id == lessonId)[0]
        // const theMaterial = theLesson.materials.filter(mat => mat._id == materialId)[0]

        //! IF AN ARRAY OF MATERIALS ARE PROVIDED !
        if (Array.isArray(req.body)) {
            const req_materials = req.body;
            const non_created_materials = req_materials.filter(m => !m._id)
            const existing_materials = req_materials.filter(m => m._id)
            
            const createNewMaterials = () => {
                non_created_materials.forEach((material) => {
                    theLesson.materials.push(material)
                })
            }

            const updateExistingMaterials = () => {
                //* for every existing materials we are looping over, and finding material item matching the _id and updating the material data
                existing_materials.forEach((material) => {
                    const theMaterial = theLesson.materials.filter(mat => mat._id == material._id)[0]
                    
                    const { title, description, source, link } = material;

                    theMaterial.title = title ? title : theMaterial.title, 
                    theMaterial.description = description ? description : theMaterial.description, 
                    theMaterial.source = source ? source : theMaterial.source, 
                    theMaterial.link = link ? link : theMaterial.link

                    // console.log(material)
                    // console.log(theMaterial)
                })
            }

            existing_materials.length && updateExistingMaterials()
            non_created_materials.length && createNewMaterials()
            
            await course.save()
            
            return res.status(200).json({ success: false, course, msg: 'the material has been updated !' })
        }
        
        
        res.status(400).json({ success: false, msg: 'The req body should be an array of contents' })
    } catch (err) {
        console.log(`deleteMaterials MW ${err}`)
        res.status(500).json({ success: false, msg: 'delete course Material error' })
    }
}

const deleteLessonVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, lessonId, videoId } = req.params;
        
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(400).json({ success: false, msg: 'course not found !' })
        }
        
        const theLesson = course.lessons.filter(lesson => lesson._id == lessonId)[0]
        const thevideos = theLesson.videos.filter(vid => vid._id != videoId)

        theLesson.videos = thevideos;

        await course.save()

        res.status(200).json({ success: true, course, msg: 'the video has been deleted !' })
    } catch (err) {
        console.log(`deleteLessonVideo MW ${err}`)
        res.status(500).json({ success: false, msg: 'delete course videos error' })
    }
}

const updateLessonVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { courseId, lessonId } = req.params;
        const course = await Course.findById(courseId)
        .populate({
            path: 'category',
            select: 'name'
        })
        .populate({
            path: 'subCategories',
        })
        .populate({
            path: 'createdBy',
            select: 'fullName email'
        })

        if (!course) {
            return res.status(400).json({ success: false, msg: 'course not found !' })
        }

        const theLesson = course.lessons.filter(lesson => lesson._id == lessonId)[0]

        //! IF AN ARRAY OF VIDEOS ARE PROVIDED !
        if (Array.isArray(req.body)) {
            const req_videos = req.body;
            const non_created_videos = req_videos.filter(v => !v._id)
            const existing_videos = req_videos.filter(v => v._id)
            
            const createNewVideos = () => {
                non_created_videos.forEach((video) => {
                    theLesson.videos.push(video)
                })
            }
            const updateExistingVideos = () => {
                //* for every existing videos we are looping over, and finding video item matching the _id and updating the video data
                existing_videos.forEach((video) => {
                    const thevideo = theLesson.videos.filter(vid => vid._id == video._id)[0]
                    
                    const { title, description, source, link } = video;

                    thevideo.title = title ? title : thevideo.title
                    thevideo.description = description ? description : thevideo.description
                    thevideo.source = source ? source : thevideo.source
                    thevideo.link = link ? link : thevideo.link
                })
            }

            existing_videos.length && updateExistingVideos()
            non_created_videos.length && createNewVideos()
            
            await course.save()
            
            return res.status(200).json({ success: true, course, msg: 'the videos has been Updated !' })
        }

        res.status(400).json({ success: false, msg: 'The req body should be an array of contents' })
    } catch (err) {
        console.log(`updateLessonVideo MW ${err}`)
        res.status(500).json({ success: false, msg: 'update course videos error' })
    }
}

const deleteProjectsAndAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, lessonId, prjId } = req.params;
        
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(400).json({ success: false, msg: 'course not found !' })
        }
        
        const theLesson = course.lessons.filter(lesson => lesson._id == lessonId)[0]
        const theprjAndAssign = theLesson.projectsAndAssignments.filter(prj => prj._id != prjId)

        theLesson.projectsAndAssignments = theprjAndAssign;

        await course.save()

        res.status(200).json({ success: true, course, msg: 'the project-and-assignment has been deleted !' })
    } catch (err) {
        console.log(`deleteProjectsAndAssignment MW ${err}`)
        res.status(500).json({ success: false, msg: 'delete course Project and assignment error' })
    }
}

const updateProjectAndAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, lessonId } = req.params;
        const { mainDescription, projects } = req.body;

        
        const course = await Course.findById(courseId)
        .populate({
            path: 'category',
            select: 'name'
        })
        .populate({
            path: 'subCategories',
        })
        .populate({
            path: 'createdBy',
            select: 'fullName email'
        })

        if (!course) {
            return res.status(400).json({ success: false, msg: 'course not found !' })
        }
        
        const theLesson = course.lessons.filter(lesson => lesson._id == lessonId)[0]

        mainDescription != theLesson.projectsAndAssignments.mainDescription ? theLesson.projectsAndAssignments.mainDescription = mainDescription : null


        const non_created_projects = projects.filter(m => !m._id)
        const existing_projects = projects.filter(m => m._id)

        const createNewProjects = () => {
            non_created_projects.forEach((project) => {
                theLesson.projectsAndAssignments.projects.push(project)
            })
        }

        const updateExistingProjects = () => {
            //* for every existing projects we are looping over, and finding project item matching the _id and updating the project data
            existing_projects.forEach((project) => {
                const theProject = theLesson.projectsAndAssignments.projects.filter(proj => proj._id == project._id)[0]
                
                const { title, description, source, link } = project;

                theProject.title != title ? theProject.title = title : null,
                theProject.description != description ? theProject.description = description : null, 
                theProject.source != source ? theProject.source = source : null,
                theProject.link != link ? theProject.link = link : null

                // console.log(project)
                // console.log(theProject)
            })
        }

        non_created_projects.length && createNewProjects()
        existing_projects.length && updateExistingProjects()

        // await course.save()

        res.status(200).json({ success: true, course, msg: 'Projects and Assignments has been updated !' })
    } catch (err) {
        console.log(`updateProjectAndAssignment MW ${err}`)
        res.status(500).json({ success: false, msg: 'update course Project and assignment error' })
    }
}

const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, lessonId, prjId } = req.params;
        const { title, description, source, link } = req.body;

        
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(400).json({ success: false, msg: 'course not found !' })
        }
        
        const theLesson = course.lessons.filter(lesson => lesson._id == lessonId)[0]
        const thePrj = theLesson.projectsAndAssignments.projects.find(p => p._id == prjId)



        if (!thePrj) {
            return res.status(400).json({ success: false, msg: `project with ${prjId} not Found !` })
        }

            title ? thePrj.title = title : thePrj.title = thePrj.title
            description ? thePrj.description = description : thePrj.description = thePrj.description
            source ? thePrj.source = source : thePrj.source = thePrj.source
            link ? thePrj.link = link : thePrj.link = thePrj.link


        await course.save()

        res.status(200).json({ success: true, course })
    } catch (err) {
        console.log(`updateProject MW ${err}`)
        res.status(500).json({ success: false, msg: 'update course Project error' })
    }
}

const GetCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        
        const course = await Course.findById(id)
        .populate({
            path: 'category',
            select: 'name'
        })
        .populate({
            path: 'subCategories',
        })
        .populate({
            path: 'createdBy',
            select: 'fullName email'
        })

        
        res.status(200).json({ success: true, course })
    } catch (err) {
        console.log(`GetCourseById MW ${err}`)
        res.status(500).json({ success: false, msg: 'Get Course By Id Course error' })
    }
}





export default {
    getAllCourses,
    CreateCourse,
    GetCourseById,
    EditCourseFirstSection,
    EditCourseSecondSection,
    createOrUpdateLesson,
    deleteQuiz,
    deleteMaterial,
    deleteLessonVideo,
    deleteProjectsAndAssignment,
    updateQuiz,
    updateMaterial,
    updateLessonVideo,
    updateProjectAndAssignment,
    updateProject
}