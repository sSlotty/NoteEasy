import { faker } from "@faker-js/faker";
import { Connection, Repository, Condition } from "typeorm";

import { CustomerEntity } from "../entites";
import 'colors';
import {hash, genSalt} from 'bcrypt'
import { get } from 'node-emoji';

export const fakeCustomers = async (conn: Connection, amount: number = 50) => {
    
    const customerRepo: Repository<CustomerEntity> = conn.getRepository(CustomerEntity);
    const time:Date = new Date()
    time.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' })
    time.setHours(time.getHours() + 7)

    for (const _ of Array.from({length: amount})) {
        const customerID:string = faker.datatype.number().toString();
        const fullName:string = faker.name.firstName()	+ ' ' + faker.name.lastName();
        const userName:string = faker.internet.userName();
        const password:string = 'secret'
        const createdAt:Date = time
        const updatedAt:Date = time

        const salt = await genSalt()
        const hashPassword = await hash(password, salt)

        const customer:Partial<CustomerEntity> = new CustomerEntity(customerID, fullName, userName, hashPassword, salt, createdAt, updatedAt);
        
        await customerRepo.save<Partial<CustomerEntity>>(customer);

    }
    const emoji = get('white_check_mark')
    console.log(`${emoji} ${amount} customers created`.yellow)

}