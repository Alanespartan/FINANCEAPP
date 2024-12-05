/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TCardFilters, UpdateCardPayload } from "@common/types/cards";
import { Card, MixinsConstructor } from "@entities";
import { filterNonNullableAttributes } from "../../cards/functions/util";

export const CardsMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        public cards: Card[] | undefined;

        /**
        * Create a new card in user information.
        * @param {Card} toAdd Contains information of new card.
        */
        public addCard(toAdd: Card) {
            this.cards!.push(toAdd);
        }

        /**
        * Checks if a card already exists in user data.
        * @param {string} cardNumber Card number to search for.
        */
        public hasCard(cardNumber: string): boolean {
            return this.cards!.find((c) => c.cardNumber === cardNumber) ? true : false;
        }

        /**
        * Get a specific stored user card using its card number id. Use hasCard() first for safety check.
        * @param {string} cardNumber Card number to search for.
        */
        public getCard(cardNumber: string): Card  {
            return this.cards!.find((c) => c.cardNumber === cardNumber) as Card;
        }

        /**
        * Get all stored user cards.
        * @param {TCardFilters} type Used to filter user cards if a type was given in the request. Otherwise, it returns all cards the user has.
        */
        public getCards(type: TCardFilters): Card[] {
            if(type !== 0) {
                return this.cards!.filter((c) => c.type === type);
            }
            return this.cards as Card[];
        }

        /**
        * Get a desired stored card and update its attributes using a given set of options.
        * @returns {Card} Updated card object.
        */
        public setOptionsIntoCard(cardNumber: string, options: UpdateCardPayload): Card {
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
