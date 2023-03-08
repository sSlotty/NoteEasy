
import { Connection, Repository } from 'typeorm';
import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

import { CustomerEntity } from '../db/entites';
import { number } from 'joi';

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
        {
            method: 'GET',
            path: '/customer',
            async handler(r: Request, h: ResponseToolkit, err?: Error) {

                let { page, limit } = r.query as { page: number, limit: number }
                
                page = Number(page) || 1
                limit = Number(limit) || 10

                const customers = await customersRepo.find({
                    skip: (page - 1) * limit,
                    take: limit
                })
                if (customers.length === 0) {
                    return h.response({ message: 'Customer not found' }).code(404);
                }

                customers.forEach((cus) => {
                    delete cus.password
                    delete cus.salt
                    delete cus?._id
                    delete cus.userName
                })
                let total = customers.length
                

                return h.response(
                    {
                        data: customers,
                        page: {
                            current: page,
                            next: total < limit ? null : page + 1,
                            limit: limit,
                        },
                        pagination: {
                            next: total > limit ? null : "http://" + process.env.HOST + ':' + 8081 + '/customer?page=' + (page + 1) + '&limit=' + limit,
                            prev: page - 1 <= 0 ? null : "http://" + process.env.HOST + ':' + 8081 + '/customer?page=' + (page - 1) + '&limit=' + limit,
                        }

                    }
                ).code(200)
            },
        }
    ];

}