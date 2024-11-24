import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { ILoan, CreateLoanPayload } from "@common/types/loans";
import { TPayFrequency } from "@common/types/util";
import { User, Bank }  from "@entities/index";

@Entity()
export class Loan implements ILoan {
    // Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public name!: string;
    @Column()
    public createdOn!: Date;
    @Column()
    public expires!: Date;
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
    // Since querying by owner is frequent, adding database indexes to improve performance
    @ManyToOne(() => User, (user) => user.loans, { nullable: false })
    @JoinColumn({ name: "ownerId" }) // Explicitly map the foreign key column
    @Index()
    public owner!: User;
    @Column()
    public ownerId!: number; // Explicitly define the foreign key column

    // Many-to-One relationship: A loan is issued by one bank
    // There is only nagivation from loan to bank, bank class does not know the relationship with loan (missing One-to-Many relationship)
    @ManyToOne(() => Bank, (bank) => bank.id, { nullable: false })
    @JoinColumn({ name: "issuerId" }) // Explicitly map the foreign key column
    public issuer!: Bank;
    @Column()
    public issuerId!: number; // Explicitly define the foreign key column

    public constructor(options?: CreateLoanPayload) {
        if(options) {
            // from payload
            this.name         = options.name;
            this.expires      = options.expires;
            this.issuer       = options.issuer;
            this.borrowed     = options.borrowed;
            this.payFrequency = options.payFrequency;
            // default options
            this.paid         = 0;
            this.interests    = 0;
            this.isFinished   = false;
            this.createdOn    = new Date();
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
