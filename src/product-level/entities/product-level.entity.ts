import { Person } from "src/person/entities/person.entity";
import { ProductFamily } from "src/product-family/entities/product-family.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("product_level")
export class ProductLevel {
    @PrimaryGeneratedColumn()
    nbr: number
    @Column()
    id: number

    @Column()
    level: string

    @ManyToOne(() => Person, perso => perso.prodLevel,
    {onDelete:"CASCADE", orphanedRowAction:"delete"})
    admin: Person | number

    @OneToMany(() => ProductFamily, family => family.level,
    {cascade:true})
    family: ProductFamily[] | number

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
