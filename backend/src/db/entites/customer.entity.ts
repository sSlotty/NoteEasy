import { Entity, ObjectID, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ShareDateColumn } from "./shareprop.entity";
import { NoteEntity } from "./note.entity";

@Entity({ name: "customers" })
export class CustomerEntity extends ShareDateColumn {

    constructor(
        customerId: string,
        fullName: string,
        userName: string,
        password: string,
        salt: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super()
        this.customerId = customerId
        this.fullName = fullName
        this.userName = userName
        this.password = password
        this.salt = salt
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
    @ObjectIdColumn({ name: "_id", type: "int",  nullable: false , primary: true, generated: true,unique: true})
    _id: ObjectID;

    @Column({ name: "customerId", type: "string", length: 100, nullable: false })
    customerId: string;

    @Column({ name: "fullName", type: "string", length: 100, nullable: false})
    fullName: string;
    
    @Column({ name: "userName", type: "string", length: 100, nullable: false })
    userName: string;

    @Column({ name: "password", type: "string", length: 100, nullable: false})
    password: string;

    @Column({ name: "salt", type: "string", length: 100, nullable: false })
    salt: string;

        
    accessToken ?: string


}
