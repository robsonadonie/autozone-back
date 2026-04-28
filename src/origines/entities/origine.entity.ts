import { Person } from "src/person/entities/person.entity";
import { ProductFamily } from "src/product-family/entities/product-family.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("origines")
export class Origine {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    pays: string

    @OneToMany(() => ProductFamily, prodF => prodF.origine,
    {cascade: true})
    family: ProductFamily[] | number

    @ManyToOne(() => Person, perso => perso.origine,
    {onDelete:"CASCADE", orphanedRowAction:"delete"})
    admin: Person | number

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
