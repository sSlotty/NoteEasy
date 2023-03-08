import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ObjectIdColumn } from 'typeorm';
import { ShareDateColumn } from './shareprop.entity';
import { NoteEntity } from './note.entity';
import { array } from 'joi';

@Entity({ name: "CategoryNote" })

export class CategoryNoteEntity extends ShareDateColumn {
    constructor(
        categoryName: string,
        noteID?: string[],
        createdAt?:Date,
        updatedAt?: Date
    ) {
        super()
        this.categoryName = categoryName
        this.noteID = noteID
        this.createdAt = createdAt
        this.updatedAt = updatedAt
   }
    
    @ObjectIdColumn({ name: "_id",  nullable: false , primary: true, generated: true,unique: true})
    _id: string;

    @Column({ name:'categoryName',nullable: false ,unique: true})
    categoryName: string;

    @Column({ name:'noteID' })
    noteID: string[];
}