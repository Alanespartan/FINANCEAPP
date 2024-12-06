import { MixinsConstructor, ExpenseCategory } from "@entities";

export const CategoriesMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /** Update expense category custom name.
         * @param name New expense category custom name to assign
         */
        public setName(this: ExpenseCategory, name: string): void {
            this.name = name;
        }
    };
};
