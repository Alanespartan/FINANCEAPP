/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { ILoan, CreateLoanPayload } from "@common/types/loans";
import { TPayFrequency } from "@common/types/util";
import { User, Bank }  from "@entities";
import { ConvertToUTCTimestamp } from "@backend/utils/functions";
import { AllLoansMixin } from "./mixins";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
// @Index is used when querying by certain "field" is frequent, and adding database indexes improves performance
// onDelete: "CASCADE" - When parent entity is deleted, related objects will be deleted too
// Use "numeric" types for all calculations such as monetary amounts: https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-FLOAT
// "numeric" storage size dependes on user-specified precision, up to 131072 digits before/after decimal point

@Entity()
export class Loan extends AllLoansMixin(class {}) implements ILoan {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public name!: string;
    @Column()
    public createdOn!: number;
    @Column()
    public expires!: number;
    @Column({ type: "numeric" })
    public fixedPaymentAmount!: number;
    @Column({ type: "numeric" })
    public borrowed!: number;
    @Column({ type: "numeric" })
    public interestsToPay!: number;
    @Column({ type: "numeric" })
    public interestsPaid!: number;
    @Column({ type: "numeric" })
    public totalPaid!: number;
    @Column({ type: "real" }) // 6 decimal digits precision
    public annualInterestRate!: number;
    @Column()
    public isFinished!: boolean;
    @Column()
    public archived!: boolean;
    @Column()
    public payFrequency!: TPayFrequency;

    // Many-to-One relationship: A loan belongs to one user, but a user can have many loans
    @ManyToOne(() => User, (user) => user.loans, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "userId" }) // Explicitly map the foreign key column
    @Index()
    public user!: User;
    @Column()
    public userId!: number; // Explicitly define the foreign key column

    // Many-to-One relationship: A loan is issued by one bank, but a bank can have issued many loans
    @ManyToOne(() => Bank, (bank) => bank.loans, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "bankId" }) // Explicitly map the foreign key column
    public bank!: Bank;
    @Column()
    public bankId!: number; // Explicitly define the foreign key column

    public constructor(options?: CreateLoanPayload, userId?: number) {
        super();
        if(options && userId) {
            // FROM PAYLOAD
            this.name         = options.name;
            this.expires      = options.expires;
            this.payFrequency = options.payFrequency;
            this.borrowed     = options.borrowed;
            this.fixedPaymentAmount = options.fixedPaymentAmount;
            this.interestsToPay     = options.interestsToPay;
            this.annualInterestRate = options.annualInterestRate;

            // RELATIONSHIP ATTRIBUTES
            this.bankId = options.bankId;

            // DEFAULT ATTRIBUTES
            this.totalPaid     = 0;
            this.interestsPaid = 0;
            this.isFinished    = false;
            this.archived      = false;
            this.createdOn     = ConvertToUTCTimestamp();
        }
        // we put this here so we can save loans adding these directly into user array
        // or by creating the object and setting the id manually.
        if(userId) {
            this.userId = userId;
        }
    }

    public toInterfaceObject(): ILoan {
        return {
            id:                 this.id,
            name:               this.name,
            createdOn:          this.createdOn,
            expires:            this.expires,
            fixedPaymentAmount: this.fixedPaymentAmount,
            borrowed:           this.borrowed,
            interestsToPay:     this.interestsToPay,
            interestsPaid:      this.interestsPaid,
            totalPaid:          this.totalPaid,
            annualInterestRate: this.annualInterestRate,
            isFinished:         this.isFinished,
            archived:           this.archived,
            payFrequency:       this.payFrequency,
            userId:             this.userId,
            bankId:             this.bankId
        };
    }
}
