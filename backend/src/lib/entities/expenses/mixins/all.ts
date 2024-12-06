import { MixinsConstructor, ExpenseType } from "@entities";

export const AllExpenseTypesMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /** Update expense type custom name.
         * @param name New expense type custom name to assign
         */
        public setName(this: ExpenseType, name: string): void {
            this.name = name;
        }
        /** Update archived expense type attribute.
         * @param {boolean} archived New archived value to assign
         */
        public setArchived(this: ExpenseType, archived: boolean): void {
            this.archived = archived;
        }
    };
};
