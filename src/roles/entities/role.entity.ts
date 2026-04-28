import { Auth } from "src/auth/entities/auth.entity";
import { Person } from "src/person/entities/person.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    role: string

    @OneToOne(() => Auth, user => user.role,
    {cascade:true})
    user: Person | number

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
