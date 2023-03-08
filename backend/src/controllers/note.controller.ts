import { Connection, Repository } from 'typeorm';
import { Request, ResponseToolkit,ServerRoute } from '@hapi/hapi';

import { CustomerEntity, NoteEntity, CategoryNoteEntity, HistoryNoteEntity } from '../db/entites';

export const NoteController = (conn: Connection): Array<ServerRoute> => {

    let Joi = require("joi");
    const noteRepo: Repository<NoteEntity> = conn.getRepository(NoteEntity);
    const customerRepo: Repository<CustomerEntity> = conn.getRepository(CustomerEntity);
    const categoryRepo: Repository<CategoryNoteEntity> = conn.getRepository(CategoryNoteEntity);
    const historyNoteRepo: Repository<HistoryNoteEntity> = conn.getRepository(HistoryNoteEntity);
    

    return [
        {
            method: 'GET',
            path: '/note/{noteID}',
            async handler({ params: { noteID } }: Request, h: ResponseToolkit, err?: Error) {

                if (err) {
                    return h.response({ message: err.message }).code(400);
                }
                const notes = await noteRepo.find({
                    where: {
                        noteID: noteID
                    }
                });
                if (notes.length === 0) {
                    return h.response({ message: 'Note not found' }).code(404);
                }
                return h.response({ data: notes }).code(200);
            }
        },
        {
            method: 'POST',
            path: '/note',
            async handler(r: Request, h: ResponseToolkit, err?: Error) {
                const { title, body, category } = r.payload as { title: string, body: string, category: string };
                const customerId = r.auth.credentials['customer']['customerId']
                const noteId = Math.floor(Math.random() * 1000000000).toString();

                let time = new Date()
                time.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' })
                time.setHours(time.getHours() + 7)
                let updatedAt = time
                let createdAt = time


                const categoryList = await categoryRepo.find({
                    where: {
                        categoryName: category
                    }
                })

                const checkCusID = await customerRepo.findOne({
                    where: {
                        customerId: customerId
                    }
                }).then((data) => {
                    return data;
                }).catch((err) => {
                    return h.response({ message: err.message }).code(400);
                });
                if (!checkCusID) {
                    return h.response({ message: 'Customer not found' }).code(404);
                }
                if (categoryList.length === 0) {
                    return h.response({ message: 'Category not found' }).code(404);
                }


                const note = new NoteEntity(noteId, title, body, customerId, category, updatedAt, createdAt);
                
                const updateCategory = [...categoryList[0].noteID, noteId]

                const newNote = await noteRepo.save(note)
                    .then((data) => {
                        return data;

                    }).catch((err) => {
                        return h.response({ message: err.message }).code(400);
                    });
                
                await categoryRepo.update({ categoryName: category }, { noteID: updateCategory, updatedAt: updatedAt })

                return h.response({ message: newNote }).code(200);
            },
            options: {
                validate: {
                    payload: Joi.object({
                        title: Joi.string().required(),
                        body: Joi.string().required(),
                        category: Joi.string().required(),
                    }) as any,
                    failAction: (request, h, err) => {
                        if (err) {
                            return h.response({ message: err.message }).code(400).takeover();
                        }
                    },
                    options: {
                        abortEarly: false
                    }
                },
                auth: {
                    strategy: 'jwt',
                },
            }

        },
        {
            method: 'GET',
            path: '/note',
            async handler({ query }: Request, h: ResponseToolkit, err?: Error) {

                console.log(query)

                if (err) {
                    return h.response({ message: err.message }).code(400);
                }
                let { page, limit } = query as { page: number, limit: number };

                page = Number(page) || 1;
                limit = Number(limit) || 10;

                const notes = await noteRepo.find({
                    skip: (page - 1) * limit,
                    take: limit,
                }).then((data) => {
                    if (data) {
                        return { data:data , count: data.length}
                    }
                    return h.response({ message: 'Note not found' }).code(404);
                }).catch((err) => {
                    return h.response({ message: err.message }).code(400);
                });
                
                let dataTotal = notes['count'];
                return h.response({
                    data: notes['data'],
                    page: {
                        current: page,
                        next: dataTotal < limit ? null : page + 1,
                        limit: limit,
                    },
                    pagination: {
                        next: dataTotal > limit ? null : "http://"+process.env.HOST + ':'+ 8081 +'/note?page=' + (page + 1) + '&limit=' + limit,
                        prev: page - 1 <= 0 ? null : "http://"+process.env.HOST + ':'+ 8081 +'/note?page=' + (page - 1) + '&limit=' + limit,
                    }
                }).code(200);
            },
        
        },
        {
            method: 'GET',
            path: '/note/customer/{customerId}',
            async handler({ params: { customerId } }: Request, h: ResponseToolkit, err?: Error) {
                const checkCusID = await customerRepo.findOne({
                    where: {
                        customerId: customerId
                    },
                }).then((data) => {
                    return data;
                }).catch((err) => {
                    return h.response({ message: err.message }).code(400);
                });
                if (!checkCusID) {
                    return h.response({ message: 'Customer not found' }).code(404);
                }
                const notes = await noteRepo.find({
                    where: {
                        customerId: customerId
                    }
                }).then((data) => {
                    if (data) {
                        return data;
                    }
                    return h.response({ message: 'Note not found' }).code(404);
                }).catch((err) => {
                    return h.response({ message: err.message }).code(400);
                });

                return h.response({
                    data: notes,

                }).code(200);
            }
        },
        {
            method: 'PUT',
            path: '/note/{noteID}',
            async handler(r: Request, h: ResponseToolkit, err?: Error) {
                const { title, body, category } = r.payload as { title: string, body: string, category: string };

                const noteID = r.params.noteID
                const customerId = r.auth.credentials['customer']['customerId']

                let time = new Date()
                time.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' })
                time.setHours(time.getHours() + 7)
                let updatedAt = time
                let createdAt = time

                const checkCusID = await customerRepo.findOne({
                    where: {
                        customerId: customerId
                    },
                });
                const checkNoteID = await noteRepo.findOne({
                    where: {
                        noteID: noteID
                    },
                });
                const categoryList = await categoryRepo.find({
                    where: {
                        categoryName: category
                    }
                })

                const historyNoteCheck = await historyNoteRepo.findOne({
                    where: {
                        noteID: noteID
                    }
                })



                if (!checkCusID) {
                    return h.response({ message: 'Customer not found' }).code(404);
                }

                if (checkNoteID.customerId !== customerId || checkCusID.customerId !== customerId) {
                    return h.response({ message: 'Customer not match' }).code(400);
                }
                
                if (!checkNoteID) {
                    return h.response({ message: 'Note not found' }).code(404);
                }
                if (categoryList.length === 0) {
                    return h.response({ message: 'Category not found' }).code(404);
                }
                
                try
                {
                    if (checkNoteID.category !== category) {
                        const updateCategory = [...categoryList[0].noteID, noteID]
                        await categoryRepo.update({ categoryName: category }, { noteID: updateCategory, updatedAt: updatedAt })
                        const updateCategory2 = categoryList[0].noteID.filter((item: string) => item !== noteID)
                        await categoryRepo.update({ categoryName: checkNoteID.category }, { noteID: updateCategory2, updatedAt: updatedAt })
                    }


                    if (historyNoteCheck === null) {
                        const historyNote = new HistoryNoteEntity(noteID, checkNoteID.customerId, [checkNoteID], createdAt, updatedAt);
                        await historyNoteRepo.save(historyNote);
                    } else {
                        // console.log('historyNoteCheck',historyNoteCheck);
                        const updateHis = [...historyNoteCheck.historyNote, checkNoteID]
                        historyNoteRepo.update({ noteID: noteID }, { historyNote: updateHis, updatedAt: updatedAt });

                    }
                    await noteRepo.update({ noteID: noteID }, { title: title, body: body,category:category, updatedAt: updatedAt })
                    return h.response({ data: r.payload }).code(200);
                }
                catch (err) {
                    return h.response({ message: err.message }).code(400);
                }
            },
            options: {
                validate: {
                    payload: Joi.object({
                        title: Joi.string().required(),
                        body: Joi.string().required(),
                        category: Joi.string().required(),
                    }) as any,
                    failAction: (request, h, err) => {
                        if (err) {
                            return h.response({ message: err.message }).code(400).takeover();
                        }
                    },
                    options: {
                        abortEarly: false
                    }
                },
                auth: {
                    strategy: 'jwt',
                },
            }
        },
        {
            method: 'DELETE',
            path: '/note/{noteID}',
            async handler( r: Request, h: ResponseToolkit, err?: Error) {

                const noteID = r.params.noteID
                const customerId = r.auth.credentials['customer']['customerId']
                
                const checkCusID = await customerRepo.findOne({
                    where: {
                        customerId: customerId
                    },
                });
                const checkNoteID = await noteRepo.findOne({
                    where: {
                        noteID: noteID
                    },
                });
                const categoryList = await categoryRepo.find({
                    where: {
                        categoryName: checkNoteID.category
                    }
                })

                if (!checkCusID) {
                    return h.response({ message: 'Customer not found' }).code(404);
                }

                if (checkNoteID.customerId !== customerId || checkCusID.customerId !== customerId) {
                    return h.response({ message: 'Customer not match' }).code(400);
                }
                if (!checkNoteID) {
                    return h.response({ message: 'Note not found' }).code(404);
                }
                if (categoryList.length === 0) {
                    return h.response({ message: 'Category not found' }).code(404);
                }
                try {
                    const updateCategory = categoryList[0].noteID.filter((item: string) => item !== noteID)
                    await categoryRepo.update({ categoryName: checkNoteID.category }, { noteID: updateCategory })
                    await noteRepo.delete({ noteID: noteID })
                    return h.response({ message: 'Delete success' }).code(200);
                }
                catch (err) {
                    return h.response({ message: err.message }).code(400);
                }
            },
            options: {
                auth: {
                    strategy: 'jwt',
                },
            }
        },
        

        
    ];
}