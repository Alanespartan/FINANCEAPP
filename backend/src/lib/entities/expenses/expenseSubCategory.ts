/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn, Index } from "typeorm";
import { IExpenseSubCategory, CreateExpenseSubCategoryPayload, TExpenseType } from "@common/types/expenses";
import { ExpenseCategory, User } from "@entities";
import { SubCategoriesMixin } from "./mixins";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
// @Index is used when querying by certain "field" is frequent, and adding database indexes improves performance
// onDelete: "CASCADE" - When parent entity is deleted, related objects will be deleted too

@Entity()
export class ExpenseSubCategory extends SubCategoriesMixin(class {}) implements IExpenseSubCategory {
    @PrimaryGeneratedColumn()
    public readonly id!: number;
    @Column()
    public name!: string;

    // Many-to-One relationship: An expense sub category belongs to one user, but a user can have many sub categories
    @ManyToOne(() => User, (user) => user.expenseSubCategories, {
        nullable: false,
        onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" }) // Explicitly map the foreign key column
    @Index()
    public user!: User;
    @Column()
    public userId!: number; // Explicitly define the foreign key column

    @Column()
    public type!: TExpenseType;

    @Column({ nullable: true })
    public instrumentId?: number;

    // Many-to-Many relationship: A category can have many sub categories and a sub category can appear in many categories
    @ManyToMany(() => ExpenseCategory, (cat) => cat.subcategories)
    public categories!: ExpenseCategory[];

    // Index signature allows using a string key to access properties
    // Note: This might cause erros with prototype if not handled correctly!!
    [key: string]: any;  // You can replace `any` with a more specific type if needed

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    public constructor(options?: CreateExpenseSubCategoryPayload, userId?: number) {
        super();
        if(options) {
            // FROM PAYLOAD
            this.name = options.name;
            this.type = options.type;

            // RELATIONSHIP ATTRIBUTES
            this.instrumentId = options.instrumentId;
        }
        // we put this here so we can save expense types adding these directly into user array
        // or by creating the object and setting the id manually.
        if(userId) {
            this.userId = userId;
        }
    }

    public toInterfaceObject(): IExpenseSubCategory {
        return {
            id:           this.id,
            name:         this.name,
            type:         this.type,
            userId:       this.userId,
            categories:   this.categories,
            instrumentId: this.instrumentId
        };
    }
}
