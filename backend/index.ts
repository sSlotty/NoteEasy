import * as Hapi from "@hapi/hapi";
import * as dotenv from 'dotenv';
import 'colors';
import { get } from 'node-emoji';

import { Server, Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { initMongoDB } from './src/db';


import { validateBasicAuth, validateJWT } from "./auth";

import { AuthCustomerController, CategoryNoteController, NoteController,CustomerController } from './src/controllers'

dotenv.config();
const options: any = {
    ops: {
        interval: 1000
    },
    reporters: {
        console: [{
            module: 'good-console'
        }, 'stdout']
    }
};


const init = async () => {
    const server: Server = Hapi.server({
        port: 8081,
        host: process.env.HOST || 'localhost'
    });



    const dbConn = await initMongoDB()
    await server.register({
        plugin: require('hapi-cors'),
        options: {
            origins: ['*'],


        }
    });
    await server.register([require('hapi-auth-jwt2')]);
    await server.register([require('@hapi/basic')]);
    // await server.register({
    //     plugin: require('@hapi/good'),
    //     options: {
    //         ops: {
    //             interval: 1000
    //         },
    //         reporters: {
    //             myConsoleReporter: [
    //                 {
    //                     module: '@hapi/good-squeeze',
    //                     name: 'Squeeze',
    //                     args: [{ log: '*', response: '*', ops: '*' }]
    //                 },
    //                 {
    //                     module: '@hapi/good-console'
    //                 },
    //                 'stdout'
    //             ]
    //         }
    //     }
    // });
    server.auth.strategy('simple', 'basic', { validate: validateBasicAuth(dbConn) });
    server.auth.strategy('jwt', 'jwt',
        {
            key: '7DB992237C7AD353D6E8C8439FCC3',
            validate: validateJWT(dbConn),
            verifyOptions: { algorithms: ['HS256'] }

        });


    server.route([
        ...AuthCustomerController(dbConn),
        ...NoteController(dbConn),
        ...CategoryNoteController(dbConn),
        ...CustomerController(dbConn)
    ] as Array<ServerRoute>);
    
    //start server
    await server.start()
        .then(() => {
            console.log(`${get('rocket')} Server running at: ${server.info.uri}`.green);
        })
        .catch((err) => {
            console.log(`${get('boom')} Error starting server: ${err.message}`.red);
            process.exit(1);
        });
};

process.on('unhandledRejection', (err) => {
    // console.log(`${get('boom')} Error starting server: ${err.message}`.red);
    console.error(err);
    process.exit(1);
})


//init server
init();