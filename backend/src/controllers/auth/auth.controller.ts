import { Connection, Repository } from 'typeorm'
import { CustomerEntity } from '../../db/entites/customer.entity'

import { ResponseToolkit, Request, ServerRoute } from '@hapi/hapi'
import { genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { number } from 'joi';

export const AuthCustomerController = (conn: Connection): Array<ServerRoute> => {
    let Joi = require("joi");
    const customerRepo: Repository<CustomerEntity> = conn.getRepository(CustomerEntity)
    return [
        {
            method: 'POST',
            path: '/register',
            async handler({ payload }: Request, h: ResponseToolkit) {
                const { fullName, userName, password } = payload as Partial<CustomerEntity>

                const time = new Date()
                time.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' })
                time.setHours(time.getHours() + 7)

                let cusID = Math.floor(Math.random() * 1000000000).toString()

                const checkCusID = await customerRepo.find({
                    where: {
                        customerId: cusID,
                    }
                })

                if (checkCusID) {
                    cusID = Math.floor(Math.random() * 1000000000).toString()
                }
                const checkUsername = await customerRepo.findOne({
                    where: {
                        userName: userName
                    }
                })

                if (checkUsername) {
                    return h.response({ message: 'Username already exists' }).code(400)
                }
                const salt = await genSalt()
                const hashPassword = await hash(password, salt)
                const customer = new CustomerEntity(cusID, fullName, userName, hashPassword, salt, time, time)

                // console.log(customer)
                try {
                    await customerRepo.save(customer)
                    delete customer.password
                    delete customer.salt
                    delete customer?._id

                    return h.response({ data: [{ user: customer, accessToken: sign({ ...customer }, '7DB992237C7AD353D6E8C8439FCC3') }] }).code(201)
                } catch (error) {
                    return h.response({ message: error.message }).code(400)
                }
            },
            options: {
                auth: false,
                validate: {
                    payload: Joi.object(
                        {
                            fullName: Joi.string().required().min(3).max(50),
                            userName: Joi.string().required().min(3).max(50),
                            password: Joi.string().required().min(3).max(15),
                        }
                    ) as any,
                    failAction: (request, h, err) => {
                        if (err) {
                            return h.response({ message: err.message }).code(400).takeover()
                        }
                    },
                    options: {
                        abortEarly: false
                    }
                }
            }
        },
        {
            method: 'POST',
            path: '/login',
            async handler({ payload, auth: { credentials } }: Request, h: ResponseToolkit) {
                // return h.response({ data: [{ user: credentials, accessToken: sign({ ...credentials }, '7DB992237C7AD353D6E8C8439FCC3') }] }).code(200)
                return h.response({ id:credentials.customerId, accessToken: sign({ ...credentials }, '7DB992237C7AD353D6E8C8439FCC3') }).code(200)

            },
            options: {
                auth: {
                    strategy: 'simple',
                },
            }
        },


    ]
}


