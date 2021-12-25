//@ts-nocheck

import mongoose, { Schema, Types } from 'mongoose';
import { Course } from '../interfaces/course.interface';

const CourseSchema: Schema = new Schema({
    title: {
        type: String
    },
    instructors: [
        {
            email: {
                type: String,
            },
            verified: {
                type: Boolean,
                default: false
            },
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'UserModel',
                default: null
            }
        }
    ],
    price: {
        regular: {
            type: String,
            default: ''
        },
        sales: {
            sales: false,
            price: ''
        }
    },
    certification: {
        has: { 
            type: Boolean,
            default: false
        },
        link: {
            type: String, 
            default: ''
        },
        name: {
            type: String, 
        }
    },
    category: {
            type: mongoose.Schema.ObjectId,
            ref: 'categories',
    },
    subCategories: [
            {
            type: mongoose.Schema.ObjectId,
            ref: 'subCategory',
            default: []
        }
    ],
    lessons: [
        {
            videos: [
                {
                    title: {
                        type: String
                    },
                    description: {
                        type: String,
                        default: ''
                    },
                    source: {
                        type: String,
                        default: ''
                    },
                    link: {
                        type: String,
                        default: ''
                    },
                }
            ],
            materials: [
                {
                    title: {
                        type: String
                    },
                    description: {
                        type: String,
                        default: ''
                    },
                    source: {
                        type: String,
                        default: ''
                    },
                    link: {
                        type: String,
                        default: ''
                    },
                }
            ],
            quiz: {
                mainDescription: {
                    type: String,
                    default: ''
                },
                quizes: [
                    {
                        questions: [String],
                    }
                ]
            },
            projectsAndAssignments: {
                mainDescription: String,
                projects: [
                    {
                        title: String,
                        description: String,
                        source: String,
                        link: String,
                    }
                ],
            },
        }
    ],
    topics: {
        type: [String],
        default: []
    },
    tags: {
        type: [String],
        default: []
    },
    description: String,
    coverPhoto: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'UserModel'
    },
    published: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Course = mongoose.model<Course>('Course', CourseSchema);
export default Course;