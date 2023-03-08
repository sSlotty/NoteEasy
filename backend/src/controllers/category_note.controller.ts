import { Connection, Repository } from 'typeorm';
import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

import { CategoryNoteEntity } from '../db/entites';


export const CategoryNoteController = (conn: Connection): Array<ServerRoute> => {

    let Joi = require("joi");
    const time = new Date()
    time.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' })
    time.setHours(time.getHours() + 7)

    const categoryNoteRepo: Repository<CategoryNoteEntity> = conn.getRepository(CategoryNoteEntity);
    return [
        {
            method: 'GET',
            path: '/category-note/{categoryName}',
            async handler({ params: { categoryName } }: Request, h: ResponseToolkit, err?: Error) {
                
                try {
                    const categoryNotes = await categoryNoteRepo.find({
                        where: {
                            categoryName: categoryName
                        }
                    });
                    if (categoryNotes.length === 0) {
                        return h.response({ message: 'Category note not found' }).code(404);
                    }
                    return h.response({ data: categoryNotes }).code(200);
                }catch (err){
                    return h.response({ message: err.message }).code(400);
                }
            }
        },
        {
            method: 'GET',
            path: '/category-note',
            async handler(r: Request, h: ResponseToolkit, err?: Error) {
                if (err) {
                    return h.response({ message: err.message }).code(400);
                }
                try {
                    const categoryNotes = await categoryNoteRepo.find();
                    if (categoryNotes.length === 0) {
                        return h.response({ message: 'Category note not found' }).code(404);
                    }
                    return h.response({ data: categoryNotes }).code(200);
                } catch (err) {
                    return h.response({ message: err.message }).code(400);
                }
            }
        },
        {
            method: 'POST',
            path: '/category-note',
            async handler({ payload }: Request, h: ResponseToolkit, err?: Error) {
                if (err) {
                    return h.response({ message: err.message }).code(400);
                }

                const { categoryName } = payload as { categoryName: string } as Partial<CategoryNoteEntity>;
                
                let createdAt: Date = time;
                let updatedAt: Date = time;
                let noteID: string[] = [];


                const checkCategoryNameIsExist = await categoryNoteRepo.find({
                    where: {
                        categoryName: categoryName
                    }
                });
                if (checkCategoryNameIsExist.length !== 0) {
                    return h.response({ message: 'Category name is exist' }).code(400);
                }
                
                const categoryNote = new CategoryNoteEntity(categoryName, noteID, createdAt, updatedAt);
                console.log(categoryNote);

                try
                {
                    await categoryNoteRepo.save(categoryNote)
                    return h.response({ data: categoryNote }).code(200);
                }catch (err){
                    return h.response({ message: err.message }).code(400);
                }
            
            },
            options: {
                validate: {
                    payload: Joi.object({
                        categoryName: Joi.string().required().min(1).max(50)
                        }) as any,
                    failAction: (request, h, err) => {
                        if (err) {
                            return h.response({ message: err.message }).code(400).takeover();
                        }
                    },
                    options: {
                        abortEarly: false
                    }
                }

            }
        }

    ]
}