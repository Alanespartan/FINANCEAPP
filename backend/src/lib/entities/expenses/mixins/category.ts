import { MixinsConstructor, ExpenseCategory, ExpenseSubCategory } from "@entities";

export const CategoriesMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /** Update expense category custom name.
        * @param {string} name New expense category custom name to assign
        */
        public setName(this: ExpenseCategory, name: string): void {
            this.name = name;
        }
        /** Add an expense sub category to array
        * @param {ExpenseSubCategory} toAdd Expense sub category to add into array
        */
        public addSubCategory(this: ExpenseCategory, toAdd: ExpenseSubCategory): void {
            this.subcategories.push(toAdd);
        }
        /**
        * Checks if a expense sub category exists in category data.
        * @param {string | number} toSearch expense sub category name or id to search for
        * @param {string} field Type field to search for (name or id)
        * @returns {boolean} True or false whether the object exists or not
        */
        public hasExpenseSubCategory(this: ExpenseCategory, toSearch: string | number, field: string): boolean {
            switch (field) {
                case "name": return this.subcategories.find((esc) => esc.name === (toSearch as string)) ? true : false;
                case "id": return this.subcategories.find((esc) => esc.id === (toSearch as number)) ? true : false;
                default: return false;
            }
        }
        /**
        * Get a specific stored expense sub category using its db id. Use hasExpenseSubCategory() first for safety check.
        * @param {number} toSearch expense sub category id to search for
        * @returns {ExpenseSubCategory} The desired expense sub category object
        */
        public getExpenseSubCategoryById(this: ExpenseCategory, toSearch: number): ExpenseSubCategory {
            return this.subcategories.find((esc) => esc.id === toSearch) as ExpenseSubCategory;
        }
        /**
        * Get a specific stored expense sub category using its name. Use hasExpenseSubCategory() first for safety check.
        * @param {string} toSearch expense sub category name to search for
        * @returns {ExpenseSubCategory} The desired expense sub category object
        */
        public getExpenseSubCategoryByName(this: ExpenseCategory, toSearch: string): ExpenseSubCategory {
            return this.subcategories.find((esc) => esc.name === toSearch) as ExpenseSubCategory;
        }
    };
};
