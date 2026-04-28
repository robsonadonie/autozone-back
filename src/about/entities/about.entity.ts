import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("about")
export class About {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    logo:string
    @Column()
    nom:string
    @Column()
    email:string
    @Column()
    telephone:string
    @Column()
    adresse:string
    @Column()
    ville:string
    @Column()
    nif:string
    @Column()
    stat:string
    @Column()
    rcs:string
    @Column()
    slogan:string
    @CreateDateColumn()
    createdAt:Date
}
