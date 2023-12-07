import { Bank } from "@common/types/util";
import { LoanOptions } from "@common/types/loans";
import { randomUUID } from "crypto";

export class Loan {
    public id: string;
    public alias: string; // default is bank name + borrowed number but can be updated by set by user
    protected holderName: string;
    protected expires: Date;
    protected issuer: Bank;
    protected borrowed: number;
    protected paid: number;
    protected isPaid: boolean;
    protected interests: number;

    public constructor(options: LoanOptions) {
        this.id         = randomUUID();
        this.holderName = options.holderName;
        this.issuer     = options.issuer;
        this.expires    = options.expires;
        this.borrowed   = options.borrowed;
        this.alias      = options.alias;
        this.paid       = 0;
        this.interests  = 0;
        this.isPaid     = false;
    }

    public setAlias(alias: string) {
        this.alias = alias;
    }

    public pay(amount: number) {
        this.paid += amount;
    }

    public closeLoan() {
        // todo add error class
        if(this.borrowed > this.paid) { throw new Error(`Couldn't complete the operation. Amount paid has not covered what was lent and interest.`); }
        this.isPaid    = true;
        this.interests = this.paid - this.borrowed;
    }
}