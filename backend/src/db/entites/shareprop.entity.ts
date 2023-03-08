import { UpdateDateColumn, CreateDateColumn,Column } from "typeorm";

export class ShareDateColumn {
    @Column({type:'timestamptz',name:'createdAt',})
    createdAt: Date;

    @Column({type: 'timestamptz', name: 'updatedAt' })
    updatedAt: Date;
}