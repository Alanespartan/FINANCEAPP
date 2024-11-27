import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { ILoan, CreateLoanPayload } from "@common/types/loans";
import { TPayFrequency } from "@common/types/util";
import { User, Bank }  from "@entities";
import { ConvertToUTCTimestamp } from "@backend/utils/functions";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
// @Index is used when querying by certain "field" is frequent, and adding database indexes improves performance

@Entity()
export class Loan implements ILoan {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public name!: string;
    @Column()
    public createdOn!: number;
    @Column()
    public expires!: number;
    @Column()
    public borrowed!: number;
    @Column()
    public paid!: number;
    @Column()
    public interests!: number;
    @Column()
    public isFinished!: boolean;
    @Column()
    public payFrequency!: TPayFrequency;

    // Many-to-One relationship: A loan belongs to one user, but a user can have many loans
    @ManyToOne(() => User, (user) => user.loans, { nullable: false })
    @JoinColumn({ name: "userId" }) // Explicitly map the foreign key column
    @Index()
    public user!: User;
    @Column()
    public userId!: number; // Explicitly define the foreign key column

    // Many-to-One relationship: A loan is issued by one bank
    // There is only nagivation from loan to bank, bank class does not know the relationship with loan (missing One-to-Many relationship)
    @ManyToOne(() => Bank, (bank) => bank.id, { nullable: false })
    @JoinColumn({ name: "bankId" }) // Explicitly map the foreign key column
    public bank!: Bank;
    @Column()
    public bankId!: number; // Explicitly define the foreign key column

    public constructor(options?: CreateLoanPayload, userId?: number) {
        if(options && userId) {
            // FROM PAYLOAD
            this.name         = options.name;
            this.expires      = options.expires;
            this.borrowed     = options.borrowed;
            this.payFrequency = options.payFrequency;

            // RELATIONSHIP ATTRIBUTES
            this.userId = userId;
            this.bankId = options.bankId;

            // DEFAULT ATTRIBUTES
            this.paid         = 0;
            this.interests    = 0;
            this.isFinished   = false;
            this.createdOn    = ConvertToUTCTimestamp();
        }
    }

    public pay(amount: number) {
        this.paid += amount;
    }

    public closeLoan() {
        // todo add error class
        if(this.borrowed > this.paid) {
            throw new Error("Couldn't complete the operation. Amount paid has not covered what was lent and interest.");
        }
        this.isFinished = true;
        this.interests  = this.paid - this.borrowed;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getName() {
        return this.name;
    }
}
