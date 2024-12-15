import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from "typeorm";
import { Card, ExpenseCategory, ExpenseSubCategory, Loan } from "@entities";
import { IUser } from "@common/types/users";
import { DefaultCategories, CreateExpenseCategoryPayload } from "@common/types/expenses";
import { CardsMixin, LoansMixin, ExpenseCategoriesMixin, ExpenseSubCategoriesMixin } from "./mixins";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Use TypeORM decorators directly in the final class instead of mixins
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
// eager: true - When user is fetched, typeorm will automatically fetch all the attached objects
// cascade: ["insert"] - unless you specify the cascade option in the relationship decorator, TypeORM wont automatically save related entities when saving the parent user entity.

@Entity()
@Unique([ "email" ]) // This creates a unique constraint on the email column
export class User extends ExpenseCategoriesMixin(ExpenseSubCategoriesMixin(CardsMixin(LoansMixin(class {})))) implements IUser {
    @PrimaryGeneratedColumn()
    public readonly id!: number;

    @Column()
    public email!: string;

    @Column()
    public password!: string;

    @Column()
    public firstName!: string;

    @Column()
    public lastName!: string;

    @Column({ default: 0 })
    public cash!: number;

    // One-to-Many relationship: A user can have many cards
    @OneToMany(() => Card, (card) => card.user, { eager: true })
    public cards!: Card[];

    // One-to-Many relationship: A user can have many loans
    @OneToMany(() => Loan, (loan) => loan.user, { eager: true })
    public loans!: Loan[];

    // One-to-Many relationship: A user can have many expense categories
    @OneToMany(() => ExpenseCategory, (category) => category.user, {
        eager: true,
        cascade: [ "insert" ]
    })
    public expenseCategories!: ExpenseCategory[];

    // One-to-Many relationship: A user can have many expense sub categories (these are added manually in the endpoints, categories are the only ones created during sign up)
    @OneToMany(() => ExpenseSubCategory, (subCategory) => subCategory.user, { eager: true })
    public expenseSubCategories!: ExpenseSubCategory[];

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    constructor(email?: string, password?: string, firstName?: string, lastName?: string) {
        super();
        if(email && password && firstName && lastName) {
            // FROM PAYLOAD
            this.email     = email;
            this.password  = password;
            this.firstName = firstName;
            this.lastName  = lastName;

            // DEFAULT ATTRIBUTES
            this.cash         = 0;
            this.cards        = [];
            this.loans        = [];
            this.expenseCategories    = [];
            this.expenseSubCategories = [];

            // create default expense categories e.g. "Other", "Unknown", "Groseries"
            for(let i = 0; i < DefaultCategories.length; i++) {
                const options = { name: DefaultCategories[i], isDefault: true } as CreateExpenseCategoryPayload;
                const toAdd = new ExpenseCategory(options);
                this.addExpenseCategory(toAdd);
            }
        }
    }

    public toInterfaceObject(): IUser {
        return {
            id:           this.id,
            email:        this.email,
            firstName:    this.firstName,
            lastName:     this.lastName,
            cash:         this.cash,
            cards:        this.cards,
            loans:        this.loans,
            expenseCategories:    this.expenseCategories,
            expenseSubCategories: this.expenseSubCategories
        };
    }
}
