import { Person } from 'src/person/entities/person.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity("users")
export class Auth {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string
    @Column()
    status: string

    @Column()
    password: string

    @Column()
    passwordConfirm: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @Column()
    role: string

    @OneToOne(() => Person, perso => perso.user,
    {cascade: true})
    person: Person | number
    

}
