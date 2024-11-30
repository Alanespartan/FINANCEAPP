import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { IExpenseType, CreateExpenseTypePayload, TExpenseType } from "@common/types/expenses";
import { User } from "@entities";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
// @Index is used when querying by certain "field" is frequent, and adding database indexes improves performance

@Entity()
export class ExpenseType implements IExpenseType {
    @PrimaryGeneratedColumn()
    public readonly id!: number;
    @Column()
    public name!: string;
    @Column()
    public archived!: boolean;

    @Column()
    public type!: TExpenseType;
    @Column({ nullable: true })
    public instrumentId?: number;

    // Many-to-One relationship: An expense category belongs to one user, but a user can have many categories
    @ManyToOne(() => User, (user) => user.expenseTypes, { nullable: false })
    @JoinColumn({ name: "userId" }) // Explicitly map the foreign key column
    @Index()
    public user!: User;
    @Column()
    public userId!: number; // Explicitly define the foreign key column

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    public constructor(options?: CreateExpenseTypePayload, userId?: number) {
        if(options && userId) {
            // FROM PAYLOAD
            this.name = options.name;
            this.type = options.type;

            // RELATIONSHIP ATTRIBUTES
            this.instrumentId = options.instrumentId;
            this.userId = userId;

            // DEFAULT ATTRIBUTES
            this.archived = false;
        }
    }
}
