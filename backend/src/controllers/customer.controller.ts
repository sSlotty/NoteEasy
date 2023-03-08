
import { Connection, Repository } from 'typeorm';
import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

import { CustomerEntity } from '../db/entites';

export const CustomerController = (conn: Connection): Array<ServerRoute> => {


    const customersRepo: Repository<CustomerEntity> = conn.getRepository(CustomerEntity);
    
    return [
        {
            method: 'GET',
            path: '/me',
            async handler(r: Request, h: ResponseToolkit, err?: Error) {
                const cus = r.auth.credentials.customer
                
                if (err) {
                    return h.response({ message: err.message }).code(400);
                }
                try {
                    const customers = await customersRepo.find({
                        where: {
                            customerId: cus['customerId']
                        }
                    });
                    if (customers.length === 0) {
                        return h.response({ message: 'Customer not found' }).code(404);
                    }
                    delete customers[0].salt
                    delete customers[0].password
                    delete customers[0]._id
                    delete customers[0].createdAt
                    delete customers[0].updatedAt
                    return h.response({ user: customers[0] }).code(200);
                } catch (err) {
                    return h.response({ message: err.message }).code(400);
                }
            },
            options: {
                auth: {
                    strategy: 'jwt',
                },
            }
        },
        {
            method: 'GET',
            path: '/customer/{customerId}',
            async handler(r: Request, h: ResponseToolkit, err?: Error) {
                
                const customers = await customersRepo.find({
                    where: {
                        customerId: r.params.customerId
                    }
                });
                if (customers.length === 0) {
                    return h.response({ message: 'Customer not found' }).code(404);
                }
                delete customers[0].salt
                delete customers[0].password
                delete customers[0]._id
                delete customers[0].createdAt
                delete customers[0].updatedAt

                return h.response({ user: customers[0] }).code(200);
            },
            // options: {
            //     auth: {
            //         strategy: 'jwt',
            //     },
            // }
        },
    ];

}