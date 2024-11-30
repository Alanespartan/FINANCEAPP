/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { User, Card } from "@entities";
import { TCardFilters, TCardTypes } from "@common/types/cards";

/**
* Create a new card in user information.
* @param {Card} toAdd Contains information of new card.
*/
export function addCard(this: User, toAdd: Card) {
    this.cards.push(toAdd);
}

/**
* Checks if a card already exists in user data.
* @param {string} cardNumber Card number to search for.
*/
export function hasCard(this: User, cardNumber: string): boolean {
    return this.getCard(cardNumber) ? true : false;
}

/**
* Get a specific stored user card using its card number id.
* @param {string} cardNumber Card number to search for.
*/
export function getCard(this: User, cardNumber: string): Card | undefined {
    return this.cards.find((c) => c.getCardNumber() === cardNumber);
}

/**
* Get all stored user cards.
* @param {TCardFilters} type Used to filter user cards if a type was given in the request. Otherwise, it returns all cards the user has.
*/
export function getCards(this: User, type: TCardFilters): Card[] {
    if(type !== 0) {
        return this.cards.filter((c) => c.getCardType() === type);
    }
    return this.cards;
}

/**
* Get the db id of a desired stored user card.
*
* Always use "hasCard()" method first so you validate the card exist in user data.
* @param {string} cardNumber Card number to search for.
*/
export function getCardId(this: User, cardNumber: string): number {
    return this.getCard(cardNumber)!.getId();
}

/**
* Get the type of a desired stored user card.
*
* Always use "hasCard()" method first so you validate the card exist in user data.
* @param {string} cardNumber Card number to search for.
*/
export function getCardType(this: User, cardNumber: string): TCardTypes {
    return this.getCard(cardNumber)!.getCardType();
}
