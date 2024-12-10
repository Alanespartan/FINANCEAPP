/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinTable, JoinColumn, Index, Unique } from "typeorm";
import { User, ExpenseSubCategory } from "@entities";
import { IExpenseCategory, CreateExpenseCategoryPayload } from "@common/types/expenses";
import { CategoriesMixin } from "./mixins";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Use TypeORM decorators directly in the final class instead of mixins
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
// eager: true - When object is fetched, typeorm will automatically fetch all the attached objects
// cascade: true - unless you specify the cascade option in the relationship decorator, TypeORM wont automatically save related entities when saving the parent user entity.

@Entity()
@Unique([ "name" ]) // This creates a unique constraint on the name column
export class ExpenseCategory extends CategoriesMixin(class {}) implements IExpenseCategory {
    @PrimaryGeneratedColumn()
    public readonly id!: number;
    @Column()
    public name!: string;
    @Column()
    public isDefault!: boolean;

    // Many-to-One relationship: A category belongs to one user, but a user can have many categories
    @ManyToOne(() => User, (user) => user.expenseCategories, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "userId" }) // Explicitly map the foreign key column
    @Index()
    public user!: User;
    @Column()
    public userId!: number; // Explicitly define the foreign key column

    // Many-to-Many relationship: A category can have many sub categories and a sub category can appear in many categories
    @ManyToMany(() => ExpenseSubCategory, (sub) => sub.categories, { eager: true, cascade: [ "insert" ] })
    @JoinTable()
    public subcategories!: ExpenseSubCategory[];

    // Index signature allows using a string key to access properties
    // Note: This might cause erros with prototype if not handled correctly!!
    [key: string]: any;  // You can replace `any` with a more specific type if needed

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    constructor(options?: CreateExpenseCategoryPayload, userId?: number) {
        super();
        if(options) {
            // FROM PAYLOAD
            this.name      = options.name;
            this.isDefault = options.isDefault;
            // DEFAULT ATTRIBUTES
            this.subcategories = [];
        }
        if(userId) {
            this.userId = userId;
        }
    }

    public toInterfaceObject(): IExpenseCategory {
        return {
            id:            this.id,
            name:          this.name,
            isDefault:     this.isDefault,
            userId:        this.userId,
            subcategories: this.subcategories
        };
    }
}

// TODO CARD update db functions JSDoc
// TODO CARD if name was updated, then update expense type
