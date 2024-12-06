import { MixinsConstructor } from "@entities";
import { BadRequestError } from "@errors";
import { Card } from "@entities";
import { OECardTypesFilters } from "@common/types/cards";

export const CreditCardMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /** Update credit card limit value.
         * @param {number} limit New limit value to assign
         */
        public setLimit(this: Card, limit: number): void {
            if(this.type !== OECardTypesFilters.CREDIT) {
                throw new BadRequestError("Can't set limit since the card is a non credit card.");
            }
            this.limit = limit;
        }
        /** Get credit card limit value.
         * @return {number} Current limit value in the card
         */
        public getLimit(this: Card): number {
            if(this.type !== OECardTypesFilters.CREDIT) {
                throw new BadRequestError("Can't get limit since the card is a non credit card.");
            }
            return this.limit;
        }
        /** Get used balance from credit card according to its given limit.
         * @return {number} Current limit value minus current balance value in the card
         */
        public getUsedCredit(this: Card): number {
            if(this.type !== OECardTypesFilters.CREDIT) {
                throw new BadRequestError("Can't get used balance since the card is a non credit card.");
            }
            return this.limit - this.balance;
        }
    };
};
