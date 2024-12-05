import { BadRequestError } from "@errors";
import { isValidCardType } from "@entities/cards/functions/util";
import { TCardTypes } from "@common/types/cards";
import { Card, Bank } from "@entities";

export function setName(this: Card, name: string): void {
    this.name = name;
}

export function setCardNumber(this: Card, cardNumber: string): void {
    this.cardNumber = cardNumber;
}

export function setExpirationDate(this: Card, expires: number): void {
    this.expires = expires;
}

export function setArchived(this: Card, archived: boolean): void {
    this.archived = archived;
}

export function setType(this: Card, type: TCardTypes): void {
    if(!isValidCardType(type)) {
        throw new BadRequestError(`Invalid type (${type}) for creating a new card.`);
    }
    this.type = type;
}

export function doPayment(this: Card, amountToPay: number): void {
    if(this.balance < amountToPay) {
        throw new BadRequestError(`Couldn't complete the payment. Insufficient funds in ${this.name}.`);
    }
    this.balance -= amountToPay;
}

export function addBalance(this: Card, amount: number): void {
    this.balance += amount;
}

export function getIssuer(this: Card): Bank {
    return this.bank;
}
