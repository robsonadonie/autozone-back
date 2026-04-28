import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("journaux")
export class Journaux {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string //depenses, recettes

    @Column()
    cause: string
    @Column()
    mode_paiement: string

    @Column()
    montant: number

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
