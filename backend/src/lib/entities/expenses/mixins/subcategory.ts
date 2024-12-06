import { MixinsConstructor, ExpenseSubCategory } from "@entities";

export const SubCategoriesMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /** Update expense sub category custom name.
         * @param name New expense sub category custom name to assign
         */
        public setName(this: ExpenseSubCategory, name: string): void {
            this.name = name;
        }
    };
};
