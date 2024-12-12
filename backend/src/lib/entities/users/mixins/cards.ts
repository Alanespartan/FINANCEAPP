import { TCardFilters, UpdateCardPayload } from "@common/types/cards";
import { MixinsConstructor, Card, User } from "@entities";
import { filterNonNullableAttributes } from "@entities/cards/functions/util";

export const CardsMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /**
        * Save a new card in user array.
        * @param {Card} toAdd New Card object to save in user array
        */
        public addCard(this: User, toAdd: Card): void {
            this.cards.push(toAdd);
        }
        /**
        * Checks if a card exists in user data.
        * @param {string} cardNumber Card number to search for
        * @returns {boolean} True or false whether the object exists or not
        */
        public hasCard(this: User, cardNumber: string): boolean {
            return this.cards.find((c) => c.cardNumber === cardNumber) ? true : false;
        }
        /**
        * Get a specific stored card using its card number to search for it. Use hasCard() first for safety check.
        * @param {string} cardNumber Card number to search for
        * @returns {Card} The desired Card object
        */
        public getCard(this: User, cardNumber: string): Card  {
            return this.cards.find((c) => c.cardNumber === cardNumber) as Card;
        }
        /**
        * Get all stored user cards.
        * @param {TCardFilters} type Used to filter user cards if a type was given in the request. Otherwise, it returns all cards the user has
        * @return {Card[]} User cards array
        */
        public getCards(this: User, type: TCardFilters): Card[] {
            if(type !== 0) {
                return this.cards.filter((c) => c.type === type);
            }
            return this.cards;
        }
        /**
        * Get a desired stored card and update its attributes using a given set of options.
        * @param {string} cardNumber
        * @param {UpdateCardPayload} options
        * @returns {Card} Updated card object.
        */
        public setOptionsIntoCard(this: User, cardNumber: string, options: UpdateCardPayload): Card {
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
    };
};
