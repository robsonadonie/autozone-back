import { Achat } from "src/achats/entities/achat.entity";
import { Person } from "src/person/entities/person.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("fournisseurs")
export class Fournisseur {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({default:null})
    telephone: string

    @Column({default:null})
    email:string

    @Column({default:null})
    adresse: string

    // @OneToMany(() => Achat, achat => achat.fournisseurs,
    // {cascade:true, nullable:true})
    // achats: Achat[] | number

    @ManyToOne(() => Person, perso => perso.fournisseurs,
    {onDelete:"CASCADE", orphanedRowAction:"delete", nullable:true})
    admin: Person | number

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date



}
