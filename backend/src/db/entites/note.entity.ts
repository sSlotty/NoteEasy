"reflect-metadata"

import { Entity, Column, ObjectIdColumn, ManyToOne,JoinColumn } from 'typeorm';
import { ShareDateColumn } from './shareprop.entity';
import { CustomerEntity } from './customer.entity';

@Entity({ name: "notes" })
export class NoteEntity extends ShareDateColumn {

    constructor(
        noteID: string,
        title: string,
        body: string,
        customerId: string,
        category?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super()
        this.noteID = noteID
        this.title = title
        this.body = body
        this.customerId = customerId
        this.category = category || 'None'
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    @ObjectIdColumn({ name: "_id", type: "int",  nullable: false , primary: true, generated: true,unique: true})
    id: number;

    @Column({ name: "noteID", type: "string", nullable: false, length: 100 })
    noteID: string;

    @Column({ name: "title", type: "string", nullable: false, length: 100 })
    title: string;

    @Column({ name: "body", type: "text", nullable: false, length: 100 })
    body: string;

    @Column({ name: "category", type: "string", length: 100 })
    category: string;

    @Column({ name: "customerId", nullable: false })
    customerId: string;

}