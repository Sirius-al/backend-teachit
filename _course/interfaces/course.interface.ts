import { Document } from 'mongoose';
import { IUser } from './../../_user/interfaces/userInterface';

export interface Lesson extends Document {
    videos: [Video];
    materials: [Material];
    quiz: {
        mainDescription: string;
        quizes: [Quiz]
    };
    projectsAndAssignments: {
        mainDescription: string;
        projects: [Project]
    };
}
export interface Certification extends Document {
    has: boolean;
    link: string;
    name: string;
}
export interface Price extends Document {
    regular: string;
    sales: {
        sales: boolean;
        price: string;
    }
}
export interface Instructor extends Document {
    email: string;
    verified: boolean;
    user?: IUser
}
export interface Video extends Document {
    title: string;
    description: string;
    source: string;
    link: string;
}
export interface Material extends Document {
    title: string;
    description: string;
    source: string;
    link: string;
}
export interface Quiz extends Document {
    questions: [string];
}
export interface Project extends Document {
    title: string;
    description: string;
    source: string;
    link: string;
}

export interface Course extends Document {
    title: string;
    category: number | string;
    description: string;
    subCategories?: [number | string];
    instructors: [Instructor];
    price: Price;
    certification: Certification;
    lessons: [Lesson];
    topics: [string];
    tags: [string];
    published: boolean;
    coverPhoto: string;
    createdBy: number | string,
    createdAt: string
}