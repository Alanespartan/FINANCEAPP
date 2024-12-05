import { User, Card } from "@entities";
import { TCardFilters, UpdateCardPayload } from "@common/types/cards";
import { filterNonNullableAttributes } from "@entities/cards/functions/util";

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
    return this.cards.find((c) => c.cardNumber === cardNumber) ? true : false;
}

/**
* Get a specific stored user card using its card number id. Use hasCard() first for safety check.
* @param {string} cardNumber Card number to search for.
*/
export function getCard(this: User, cardNumber: string): Card  {
    return this.cards.find((c) => c.cardNumber === cardNumber) as Card;
}

/**
* Get all stored user cards.
* @param {TCardFilters} type Used to filter user cards if a type was given in the request. Otherwise, it returns all cards the user has.
*/
export function getCards(this: User, type: TCardFilters): Card[] {
    if(type !== 0) {
        return this.cards.filter((c) => c.type === type);
    }
    return this.cards;
}

/**
* Get a desired stored card and update its attributes using a given set of options.
* @returns {Card} Updated card object.
*/
export function setOptionsIntoCard(this: User, cardNumber: string, options: UpdateCardPayload): Card {
    // javascript handles objects by reference, by updating the card object here we dont need to update it in the endpoint
    const toUpdate = this.getCard(cardNumber) as Card;

    // build payload from non null/undefined options
    const payload = filterNonNullableAttributes(options);
    // apply the new values from given options into desired card
    Object.entries(payload).forEach(([ key, value ]) => {
        if(key in toUpdate) {
            toUpdate[key] = value;
        }
    });

    return toUpdate;
}
