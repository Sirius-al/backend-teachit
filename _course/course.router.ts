import express from 'express';
import courseController from './course.controller';
import { authorize } from './../_auth/auth.middleware';

const courseRouter = express.Router();

// ---> All Auth Related Routers 
// --> Register

//? TESTING ROUTE
// courseRouter.route('/test').get(protectedRoute)

//! Route:    GET => /course/getall
//? Desc:     get all courses
//? access:   Public
courseRouter.route('/getall').get(courseController.getAllCourses)

//! Route:    POST => /course/
//? Desc:     Create course
//? access:   Private
courseRouter.route('/').post(authorize, courseController.CreateCourse)

//! Route:    PATCH => /course/section1/:id
//? Desc:     update course the first section of the course
//? access:   Private
courseRouter.route('/section1/:id').patch(authorize, courseController.EditCourseFirstSection)

//! Route:    PATCH => /course/section2/:id
//? Desc:     update course the second section of the course
//? access:   Private
courseRouter.route('/section2/:id').patch(authorize, courseController.EditCourseSecondSection)

//! Route:    PATCH => /course/lesson/:courseId/:lessonId?
//? Desc:     creaete or update course lessons
//? access:   Private
courseRouter.route('/lesson/:courseId/:lessonId?').patch(authorize, courseController.createOrUpdateLesson)

//! Route:    DELETE => /course/quiz/:courseId/:lessonId/:quizId
//? Desc:     delete quiz by course id, lesson id and quiz id
//? access:   Private
courseRouter.route('/quiz/:courseId/:lessonId/:quizId').delete(authorize, courseController.deleteQuiz)

//! Route:    PATCH => /course/quiz/:courseId/:lessonId/:quizId
//? Desc:     update quizes by course id, lesson id
//? access:   Private
courseRouter.route('/quiz/:courseId/:lessonId/').patch(authorize, courseController.updateQuiz)

//! Route:    DELETE => /course/material/:courseId/:lessonId/:materialId
//? Desc:     delete material by course id, lesson id and material id
//? access:   Private
courseRouter.route('/material/:courseId/:lessonId/:materialId').delete(authorize, courseController.deleteMaterial)

//! Route:    PATCH => /course/material/:courseId/:lessonId/
//? Desc:     update material by course id, lesson id
//? access:   Private
courseRouter.route('/material/:courseId/:lessonId/').patch(authorize, courseController.updateMaterial)

//! Route:    DELETE => /course/video/:courseId/:lessonId/:videoId
//? Desc:     delete video by course id, lesson id and video id
//? access:   Private
courseRouter.route('/video/:courseId/:lessonId/:videoId').delete(authorize, courseController.deleteLessonVideo)

//! Route:    PATCH => /course/video/:courseId/:lessonId/
//? Desc:     Update video by course id, lesson id
//? access:   Private
courseRouter.route('/video/:courseId/:lessonId/').patch(authorize, courseController.updateLessonVideo)

//! Route:    DELETE => /course/project/:courseId/:lessonId/:prjId
//? Desc:     delete projectsAndAssignment by course id, lesson id and projectsAndAssignment id
//? access:   Private
courseRouter.route('/project/:courseId/:lessonId/:prjId').delete(authorize, courseController.deleteProjectsAndAssignment)

//! Route:    PATCH => /course/project/:courseId/:lessonId/
//? Desc:     update projectsAndAssignment by course id, lesson id { mainDescription, projects }
//? access:   Private
courseRouter.route('/project/:courseId/:lessonId/').patch(authorize, courseController.updateProjectAndAssignment)

//! Route:    PATCH => /course/project/:courseId/:lessonId/:prjId
//? Desc:     update project {title, desc, source, link}
//? access:   Private
courseRouter.route('/project/:courseId/:lessonId/:prjId').patch(authorize, courseController.updateProject)

//! Route:    POST => /course/:id
//? Desc:     get course by course id
//? access:   Private
courseRouter.route('/:id').get(authorize, courseController.GetCourseById)


export default courseRouter;