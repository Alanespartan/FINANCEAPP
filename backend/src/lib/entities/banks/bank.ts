import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IBank } from "@common/types/util";
import { Card, Loan } from "@entities";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks

@Entity()
export class Bank implements IBank {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public name!: string;
    @Column()
    public country!: string;

    // One-to-Many relationship: A bank can have issued many cards
    @OneToMany(() => Card, (card) => card.bank)
    public cards!: Card[];

    // One-to-Many relationship: A bank can have issued many loans
    @OneToMany(() => Loan, (loan) => loan.bank)
    public loans!: Loan[];

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    public constructor(name?: string, country?: string) {
        if(name && country) {
            this.name = name;
            this.country = country;
            this.cards = [];
            this.loans = [];
        }
    }
}
