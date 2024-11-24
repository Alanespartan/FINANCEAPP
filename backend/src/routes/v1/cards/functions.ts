import { BadRequestError, NotFoundError } from "@backend/lib/errors";
import { TCardFilters, TCardTypes, OECardTypesFilters, UpdateCardPayload }   from "@common/types/cards";
import { User } from "@backend/lib/entities";

export const isValidCardFilter = (value: number): value is TCardFilters => {
    return value === OECardTypesFilters.ALL
        || value === OECardTypesFilters.DEBIT
        || value === OECardTypesFilters.CREDIT
        || value === OECardTypesFilters.SERVICES;
};

export const isValidCardType = (value: number): value is TCardTypes => {
    return value === OECardTypesFilters.DEBIT
        || value === OECardTypesFilters.CREDIT
        || value === OECardTypesFilters.SERVICES;
};

export function ValidateUpdateCardPayload(user: User, cardNumber: string, options: UpdateCardPayload): boolean {
    // remove any whitespace and then validate the cardNumber contains only numbers
    if( !( /^[0-9]+$/.test(cardNumber.replace(/\s+/g, "")) ) ) {
        throw new BadRequestError(`Invalid card number "${cardNumber}". A card number can not contain non numeric chars.`);
    }

    // check a card with the given card number exists
    const card = user.getCard(cardNumber);
    if(!card) throw new NotFoundError(`There is no "${cardNumber}" card in the user data.`);

    const category = user.getCategory(card.getAlias()); // use current alias to get existing category
    if(!category) throw new NotFoundError(`There is no "${card.getAlias()}" registered as an expense category.`);

    // NEW CARD NUMBER
    if(options.cardNumber) {
        // card number to update and new card number can't be the same
        if(cardNumber.replace(/\s+/g, "") === options.cardNumber.replace(/\s+/g, "")) {
            throw new BadRequestError(`The card to update has already the provided new "${options.cardNumber}" card number.`);
        }

        // avoid creating a duplicate if the card number already exists in another card
        if(user.getCard(options.cardNumber)) {
            throw new BadRequestError(`A card with the "${options.cardNumber}" card number already exist in user data.`);
        }
    }

    // ARCHIVED
    if(options.archived === card.getArchived()) {
        throw new BadRequestError(`"${options.cardNumber}" card already has "${options.archived}" as archived value.`);
    }

    // CARD EXPIRATION DATE
    if(options.expires) {
        if(new Date(options.expires).getTime() < new Date().getTime()) {
            throw new BadRequestError(`New expiration date "${options.expires}" can't be less than today's date.`);
        }
    }

    // CARD TYPE
    if(options.type) {
        if(!isValidCardType(options.type)) {
            throw new BadRequestError(`Invalid card type: "${options.type}" for updating "${card.getAlias()}" card.`);
        }

        // if new type is credit card
        if(options.type === OECardTypesFilters.CREDIT) {
            // ensure a limit was sent in the payload
            if(!options.limit) {
                throw new BadRequestError(`No limit value was provided for updating "${card.getAlias()}" card to be a Credit Card.`);
            }
        }

        // TODO if new type is service card (e.g. AMEX PLATINUM no limit)
    }

    // LIMIT
    if(options.limit) {
        if(card.getCardType() !== OECardTypesFilters.CREDIT) {
            throw new BadRequestError("Can't modify the limit attribute from a non credit card.");
        }

        if(options.limit <= 0) {
            throw new BadRequestError("Can't modify the limit of a credit card to have a value of less or equal to 0.");
        }
    }

    return true;
}
