/* eslint-disable @typescript-eslint/no-explicit-any */
import { TCardFilters, TCardTypes, OECardTypesFilters, UpdateCardPayload, CreateCardPayload } from "@common/types/cards";
import { getBank } from "@entities/cards/functions/db"; // TODO MOVE THIS TO DB FILE OR BANK DEDICATED FILE
import { BadRequestError, ServerError } from "@errors";
import { User } from "@entities";
import { ConvertToUTCTimestamp } from "@backend/utils/functions";

/**
* @param {User} user User data to perform helper checks if needed
* @param {CreateCardPayload | UpdateCardPayload} body Payload to analyze
* @param {string} action Indicates what type of extra checks to do according to operation type
* @param {string} toSaveName Its the card to create/update name, used for customizing error messages if needed
* @throws BadRequestError if invalid parameter value is found
* @throws ServerError if developer makes a mistake invoking the function
*/
export async function RunPayloadsParamsChecks(user: User, body: CreateCardPayload | UpdateCardPayload, action: string, toSaveName: string) {
    let options;
    let actionMessage;

    // check parameters present only in certain type of payload
    if(action === "create") {
        options = body as CreateCardPayload;
        actionMessage = "created";

        // assigned bank does exist in db
        if( !(await getBank(options.bankId)) ) {
            throw new BadRequestError(`Card "${options.cardNumber}" cannot be created because an incorrect bank id was used in the request: ${options.bankId}.`);
        }

        // normalizing the card number by removing white spaces and then validate the cardNumber contains only numbers
        options.cardNumber = options.cardNumber.replace(/\s+/g, "");
        if( !( /^[0-9]+$/.test(options.cardNumber) ) ) {
            throw new BadRequestError(`Card "${options.cardNumber}" cannot be created because a card number can not contain non numeric chars.`);
        }

        // avoid creating a duplicate if a card with the given card number already exists
        if(user.hasCard(options.cardNumber)) {
            throw new BadRequestError(`Card "${options.cardNumber}" cannot be created because one with that card number already exists.`);
        }

        // avoid creating a card if incorrect type was given in the request
        if(!IsValidCardType(options.type)) {
            throw new BadRequestError(`Card "${options.cardNumber}" cannot be created because an incorrect type was used in the request: ${options.type}.`);
        }

        switch (options.type) {
            case OECardTypesFilters.DEBIT:
                if(options.limit) {
                    throw new BadRequestError(`Debit card "${options.cardNumber}" cannot be created because an incorrect card limit was used in the request: ${options.type}.`);
                }
                break;
            case OECardTypesFilters.CREDIT:
                if(!options.limit) {
                    throw new BadRequestError(`Credit card "${options.cardNumber}" cannot be created because no limit value was given to create the card.`);
                }
                if(options.limit <= 0) {
                    throw new BadRequestError(`Credit card "${options.cardNumber}" cannot be created because an incorrect card limit was used in the request: ${options.limit}.`);
                }
                if(options.isVoucher) {
                    throw new BadRequestError(`Credit card "${options.cardNumber}" cannot be created because it can not be categorized as voucher card.`);
                }
                if(options.balance < 0 || options.balance > options.limit) {
                    // TODO CARD validate this scenario is working correclty: if new card is added with used balance or full balance
                }
                break;
            case OECardTypesFilters.SERVICES:
                // services extra logic here
                break;
        }
    } else if(action === "update") {
        options = body as UpdateCardPayload;
        actionMessage = "updated";

        /* CARD NUMBER */
        if(options.cardNumber) {
            // normalizing the given card number by removing white spaces
            options.cardNumber = options.cardNumber.replace(/\s+/g, "");

            // the new cardNumber contains only numbers
            if(!( /^[0-9]+$/.test(options.cardNumber) )) {
                throw new BadRequestError(`Card "${toSaveName}" cannot be ${actionMessage} because the new card number "${options.cardNumber}" can not contain non numeric chars.`);
            }

            // avoid creating a duplicate if a card with the new card number already exists
            if(user.hasCard(options.cardNumber)) {
                throw new BadRequestError(`Card "${toSaveName}" cannot be ${actionMessage} because one with the new card number "${options.cardNumber}" already exists.`);
            }
        }

        /* CARD EXPIRATION DATE */
        if(options.expires) {
            // using UTC function for correct timestamp comparision
            if(ConvertToUTCTimestamp(options.expires) < ConvertToUTCTimestamp(new Date())) {
                throw new BadRequestError(`Card "${toSaveName}" cannot be ${actionMessage} because new expiration date "${options.expires}" can't be less than today's date.`);
            }
        }

        /* CARD TYPE */
        let typeModified = false;
        if(options.type) {
            typeModified = true;
            if(!IsValidCardType(options.type)) {
                throw new BadRequestError(`Card "${toSaveName}" cannot be ${actionMessage} because an incorrect new card type was used in the request: ${options.type}.`);
            }

            // if new type is debit card
            if(options.type === OECardTypesFilters.DEBIT) {
                // ensure no limit was sent in the payload
                if(options.limit) {
                    throw new BadRequestError(`Card "${toSaveName}" cannot be ${actionMessage} to debit card because an incorrect card limit was used in the request: ${options.limit}.`);
                }
                // avoid users modying limit of new debit card (previous credit card)
                // and restart limit value to default 0 to avoid errors
                options.limit = 0;
            }

            // if new type is credit card
            if(options.type === OECardTypesFilters.CREDIT) {
                // ensure a limit was sent in the payload
                if(!options.limit) {
                    throw new BadRequestError(`Card "${toSaveName}" cannot be ${actionMessage} to credit card because no limit value was given in the request.`);
                }

                if(options.limit <= 0) {
                    throw new BadRequestError(`Card "${toSaveName}" cannot be ${actionMessage} to credit card because an incorrect card limit was used in the request: ${options.limit}.`);
                }

                if(options.isVoucher) {
                    throw new BadRequestError(`Card "${toSaveName}" cannot be ${actionMessage} to credit card because it can not be categorized as voucher card.`);
                }

                // avoid users modying voucher state of new credit card (previous debit card)
                // and restart voucher value to default false to avoid errors
                options.isVoucher = false;
            }
        }

        /* LIMIT */
        if(options.limit && !typeModified) {
            // if user wants to set a limit to the given card to update but its not a credit card
            if(user.getCard(toSaveName).type !== OECardTypesFilters.CREDIT) {
                throw new BadRequestError(`Card "${toSaveName}" cannot be ${actionMessage} because a card limit (${options.limit}) was used in the request to update a non credit card.`);
            }
            // if the new limit of a credit card is less or equal to 0
            if(options.limit <= 0) {
                throw new BadRequestError(`Credit card "${toSaveName}" cannot be ${actionMessage} because an incorrect card limit was used in the request: ${options.limit}.`);
            }
        }

        /* IS VOUCHER */
        if(options.isVoucher && !typeModified) {
            // if user wants to set a limit to the given card to update but its not a credit card
            if(user.getCard(toSaveName).type !== OECardTypesFilters.DEBIT) {
                throw new BadRequestError(`Card "${toSaveName}" cannot be ${actionMessage} because it can not be categorized as voucher card.`);
            }
        }
    } else {
        throw new ServerError("An error occurred while analyzing card request payload.");
    }

    // check parameters found in both payloads (creation and update)
    options = body;
}

/**
 * Ensures body is in correct format and all required information is present to create a card.
 * @param {unknown} body Body from create card request.
 * @returns bodyisCreateCardPayload wheter or not the body is valid
 */
export function VerifyCreateCardBody(body: unknown): body is CreateCardPayload {
    if(!body || typeof body !== "object") {
        return false; // Reject null, undefined, or non-object values
    }

    const bodyOptions = Object.entries(body).map(([ key, ]) => key);

    // Check if all required keys exist and have valid types
    for(const key of bodyOptions) {
        const value = (body as Record<string, unknown>)[key];

        switch (key) {
            case "cardNumber":
            case "name":
                if(typeof value !== "string") return false;
                break;
            case "expires":
            case "type":
            case "bankId":
            case "balance":
            case "cutOffDate":
            case "paymentDate":
            case "limit":
            case "isVoucher":
                if(typeof value !== "number") return false;
                break;
            default: return false; // Unexpected key found
        }
    }

    return true;
}

/**
 * Ensures body is in correct format and all required information is present to update a card.
 * @param {unknown} body Body from update card request.
 * @returns bodyisUpdateCardPayload wheter or not the body is valid
 */
export function VerifyUpdateCardBody(body: unknown): body is UpdateCardPayload {
    if(!body || typeof body !== "object") {
        return false; // Reject null, undefined, or non-object values
    }

    const bodyOptions = Object.entries(body).map(([ key, ]) => key);

    // Validate optional fields
    for(const key of bodyOptions) {
        const value = (body as Record<string, unknown>)[key];
        if(value !== undefined) {
            switch (key) {
                case "cardNumber":
                case "name":
                    if(typeof value !== "string") return false;
                    break;
                case "type":
                case "expires":
                case "limit":
                case "cutOffDate":
                case "paymentDate":
                    if(typeof value !== "number") return false;
                    break;
                case "isVoucher":
                case "archived":
                    if(typeof value !== "boolean") return false;
                    break;
                default: return false; // Unexpected key found
            }
        }
    }

    return true;
}

/** Helper function to check if the given value is a valid value from card filters enum. */
export const IsValidCardFilter = (value: number): value is TCardFilters => {
    return value === OECardTypesFilters.ALL
        || value === OECardTypesFilters.DEBIT
        || value === OECardTypesFilters.CREDIT
        || value === OECardTypesFilters.SERVICES;
};

/** Helper function to check if the given value is a valid value from card types enum. */
export const IsValidCardType = (value: number): value is TCardTypes => {
    return value === OECardTypesFilters.DEBIT
        || value === OECardTypesFilters.CREDIT
        || value === OECardTypesFilters.SERVICES;
};
