import 'reflect-metadata';
import { Connection, createConnection, DataSource} from 'typeorm';
import { get } from 'node-emoji';
import { CustomerEntity, NoteEntity, HistoryNoteEntity, CategoryNoteEntity } from './entites';
import { fakeCategoryNotes, fakeCustomers,fakeNotes } from './fakeData';

export const initMongoDB = async (): Promise<Connection> => {

     const fakeFuncs = [
          // fakeCategoryNotes,
          // fakeCustomers,
          // fakeNotes,
     ];

     const conn = await createConnection({
          type: 'mongodb',
          url: process.env.MONGODB_URI,
          useUnifiedTopology: true,
          entities: [CustomerEntity, NoteEntity, CategoryNoteEntity, HistoryNoteEntity],
          useNewUrlParser: true,
          logging: ['error', 'warn', 'info', 'log', 'schema'],
          migrations: [],
          subscribers: [],


     }).then((conn) => {
          console.log(`${get('rocket')} Connected to MongoDB`.green);
          return conn;
     }).catch((err) => {
          console.log(`${get('boom')} Error connecting to MongoDB: ${err.message}`.red);
          process.exit(1);
     });

     
     
     for (const entity of conn.entityMetadatas) {
          console.log(`${get('pick') } Entity: ${entity.name}`.blue);
     }
     console.log(`${get('pick')} Create Fake Data`.blue.bold);
     for (const fakeFunc of fakeFuncs) {
          await fakeFunc(conn);
     }

     // await conn.synchronize(true);
     return conn;
}