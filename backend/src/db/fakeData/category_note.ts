import { faker } from "@faker-js/faker";
import { Connection, Repository, Condition } from "typeorm";

import { CategoryNoteEntity } from "../entites";
import 'colors';
import { hash, genSalt } from 'bcrypt'
import { get } from 'node-emoji';

export const fakeCategoryNotes = async (conn: Connection) => {

    const categoryRepo: Repository<CategoryNoteEntity> = conn.getRepository(CategoryNoteEntity);
    const time = new Date()
    time.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' })
    time.setHours(time.getHours() + 7)
    const category: string[] = ['Work', 'Study', 'Personal', 'Other']
    for (const cat of category) {
        console.log(cat)
        categoryRepo.save<Partial<CategoryNoteEntity>>(new CategoryNoteEntity(cat, [], time, time))

    }

    const emoji = get('white_check_mark')
    console.log(`${emoji} ${category.length} category created`.yellow)

}