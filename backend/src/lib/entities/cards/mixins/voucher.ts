import { BadRequestError } from "@errors";
import { OECardTypesFilters } from "@common/types/cards";
import { MixinsConstructor, Card } from "@entities";

export const VoucherCardMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /** Update isVoucher card attribute.
         * @param {boolean} isVoucher New is voucher value to assign
         */
        public setIsVoucher(this: Card, isVoucher: boolean): void {
            if(this.type !== OECardTypesFilters.DEBIT) {
                throw new BadRequestError("Can't set voucher state since the card is a non debit card.");
            }
            this.isVoucher = isVoucher;
        }
        /** Get isVoucher value if card id debit, otherwise throws an error.
         * @return {boolean} Current is voucher state
         */
        public getIsVoucher(this: Card): boolean {
            if(this.type !== OECardTypesFilters.DEBIT) {
                throw new BadRequestError("Can't get voucher state since the card is a non debit card.");
            }
            return this.isVoucher;
        }
    };
};
