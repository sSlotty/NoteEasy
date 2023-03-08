import { faker } from "@faker-js/faker";
import { Connection, Repository, Condition } from "typeorm";

import { NoteEntity, CustomerEntity, CategoryNoteEntity } from "../entites";
import 'colors';
import { hash, genSalt } from 'bcrypt'
import { get } from 'node-emoji';

export const fakeNotes = async (conn: Connection, amount: number = 50) => {

    const customerRepo: Repository<CustomerEntity> = conn.getRepository(CustomerEntity);
    const noteRepo: Repository<NoteEntity> = conn.getRepository(NoteEntity);
    const noteCategoryRepo: Repository<CategoryNoteEntity> = conn.getRepository(CategoryNoteEntity);

    const time = new Date()
    time.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' })
    time.setHours(time.getHours() + 7)
    const fetchCustomer = await customerRepo.find()
    const categoryNote = await noteCategoryRepo.find()
    const catList = categoryNote.map((data, index) => { return index.toString, data.categoryName })

    for (const customer of fetchCustomer) {
        for (const _ of Array.from({ length: amount })) {
            const noteID:string = faker.datatype.number().toString();
            const title:string = faker.lorem.sentence();
            const content:string = faker.lorem.paragraph();
            const customerID:string = customer.customerId
            const createdAt:Date = faker.date.past();
            const updatedAt:Date = faker.date.recent();

            const category = catList[Math.floor(Math.random() * catList.length)]

            const oldFiled = await noteCategoryRepo.find({
                where: {
                    categoryName: category
                }
            })
            const newField = [...oldFiled[0].noteID, noteID]
            noteCategoryRepo.update({ categoryName: category }, {
                noteID: newField,
                updatedAt: time
            })


            const note: Partial<NoteEntity> = new NoteEntity(noteID, title, content, customerID, category,createdAt, updatedAt);
            await noteRepo.save<Partial<NoteEntity>>(note);

        }
    }
    
    let amountNote = fetchCustomer.length
    const emoji = get('white_check_mark')
    console.log(`${emoji} ${amountNote} Note created`.yellow)

}