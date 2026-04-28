import { Facture } from "src/facture/entities/facture.entity";
import { Person } from "src/person/entities/person.entity";
import { Vente } from "src/ventes/entities/vente.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("client")
export class Client {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({default: null})
    firstName: string

    @Column({default: null})
    telephone: string

    @Column({default: null})
    adresse: string
    @Column({default: "fidele"})
    status: string

    // @Column({default: null})
    // code_postal: string

    // @Column({default: null})
    // ville: string

    // @Column({default: null})
    // pays: string

    @Column({default: null})
    email: string

    @Column({default:null})
    nif: string

    @Column({default:null})
    stat: string

    @Column({default: null})
    type: string //entreprise, personnel...

    @OneToMany(() => Vente, vente => vente.client,
    {cascade:true})
    vente: Vente

    @OneToMany(() => Facture, facture => facture.client,
    {cascade:true})
    facture: Facture

    @ManyToOne(() => Person, perso => perso.client,
    {onDelete:"CASCADE", orphanedRowAction:"delete"})
    admin: Person | number | null

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
