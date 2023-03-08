import { Connection, Repository } from 'typeorm';

import { Request, ResponseToolkit } from '@hapi/hapi';
import { CustomerEntity } from './src/db/entites';
import { hash } from 'bcrypt';

export const validateJWT = (con: Connection) => {
    const customerRepo: Repository<CustomerEntity> = con.getRepository(CustomerEntity);

    return async (
        { customerId }: Partial<CustomerEntity>,
        request: Request,
        h: ResponseToolkit
    ) => {
        
        const customer: CustomerEntity = await customerRepo.findOne({
            where: {
                customerId: customerId,
            },
        });

        if (!customer) {
            return { isValid: false };
        }
        delete customer.salt
        delete customer.password

        return { isValid: true, credentials: { customer } };
    };
};

export const validateBasicAuth = (conn: Connection) => {

    const customerRepo :Repository<CustomerEntity> = conn.getRepository(CustomerEntity);

    return async(
        request: Request,
        username: string,
        password: string,
        h: ResponseToolkit
    ) => {
        const customer:CustomerEntity = await customerRepo.findOne({
            where: {
                userName: username,
            },
        });

        if (!customer) {
            return { credentials: null, isValid: false };
        }

        const isValid = await hash(password, customer.salt) === customer.password;
        delete customer.salt
        delete customer.password
        delete customer?._id
        

        return { isValid: isValid, credentials: customer };
    }

}