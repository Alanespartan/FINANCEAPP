import { BadRequestError } from "@errors";
import { isValidCardType } from "@entities/cards/functions/util";
import { TCardTypes } from "@common/types/cards";
import { MixinsConstructor, Card, Bank } from "@entities";

export const AllCardsMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /** Update card custom name.
         * @param name New card custom name to assign
         */
        public setName(this: Card, name: string): void {
            this.name = name;
        }
        /** Update card number.
         * @param {string} cardNumber New card number to assign
         */
        public setCardNumber(this: Card, cardNumber: string): void {
            this.cardNumber = cardNumber;
        }
        /** Update card expiration date using a timestamp date.
         * @param {number} expires New expiration date in timestamp format to assign
         */
        public setExpirationDate(this: Card, expires: number): void {
            this.expires = expires;
        }
        /** Update archived card attribute.
         * @param {boolean} archived New archived value to assign
         */
        public setArchived(this: Card, archived: boolean): void {
            this.archived = archived;
        }
        /** Update card type, if given value is not valid throws an error.
         * @param {TCardTypes} type New card type value to assign
         */
        public setType(this: Card, type: TCardTypes): void {
            if(!isValidCardType(type)) {
                throw new BadRequestError(`Invalid type (${type}) for creating a new card.`);
            }
            this.type = type;
        }
        /** Reduce balance from card if there is enough to do a payment, otherwise throws an error.
         * @param {number} amountToPay A number equivalent to the amount of money to substract from the available card balance
         */
        public doPayment(this: Card, amountToPay: number): void {
            if(this.balance < amountToPay) {
                throw new BadRequestError(`Couldn't complete the payment. Insufficient funds in ${this.name}.`);
            }
            this.balance -= amountToPay;
        }
        /** Add money to card balance.
         * @param {number} amount A number equivalent to the amount of money to add into the current balance
         */
        public addBalance(this: Card, amount: number): void {
            this.balance += amount;
        }
        /** Get issuer bank information.
         * @return {Bank} The desired card issuer bank object
         */
        public getIssuer(this: Card): Bank {
            return this.bank;
        }
    };
};
