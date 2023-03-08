import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ShareDateColumn } from './shareprop.entity';
import { NoteEntity } from './note.entity';


@Entity({ name: "HistoryNote" })
export class HistoryNoteEntity extends ShareDateColumn {
    constructor(
        noteID: string,
        customerID: string,
        historyNote: NoteEntity[],
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super()
        this.noteID = noteID
        this.customerID = customerID
        this.historyNote = historyNote
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
    @ObjectIdColumn({ name: "_id", type: "int",  nullable: false , primary: true, generated: true,unique: true})
    _id: string;

    @Column({ nullable: false, type: "string", name: "noteID" })
    noteID: string;

    @Column({ nullable: false, type: "string", name: "customerID" })
    customerID: string;        

    @Column({ nullable: false, name: "historyNote" })
    historyNote: NoteEntity[];


}