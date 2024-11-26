import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, Index } from "typeorm";
import { IExpenseType, CreateExpenseTypePayload } from "@common/types/expenses";
import { User } from "@entities";

// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks

@Entity()
@Unique([ "type", "instrumentId" ]) // Composite unique key
export class ExpenseType implements IExpenseType {
    @PrimaryGeneratedColumn()
    public readonly id!: number;
    @Column()
    public name!: string;
    @Column()
    public archived!: boolean;

    @Column()
    public type!: number; // TODO EXPENSE CATEGORY create type to handle card, loan, savings, etc
    @Column()
    public instrumentId!: number;

    // Many-to-One relationship: An expense category belongs to one user, but a user can have many categories
    // Since querying by owner is frequent, adding database indexes to improve performance
    @ManyToOne(() => User, (user) => user.expenseTypes, { nullable: false })
    @JoinColumn({ name: "ownerId" }) // Explicitly map the foreign key column
    @Index()
    public owner!: User;
    @Column()
    public ownerId!: number; // Explicitly define the foreign key column

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    public constructor(options?: CreateExpenseTypePayload) {
        if(options) {
            // TODO EXPENSE CATEGORY create pyaload for create operation
        }
    }
}
