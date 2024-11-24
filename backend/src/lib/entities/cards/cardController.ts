/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@backend/lib/errors";
import { Card }  from "@entities";
import DBContextSource from "@db";

class CardController {
    protected cardStore = DBContextSource.getRepository(Card);

    /*
    public async create(newCard: Card) {
        console.log(newCard);
        const foundCard = await this.getByCardNumber(newCard.cardNumber);
        if(foundCard) {
            throw new BadRequestError(`A card with the same "${newCard.cardNumber}" card number already exists.`);
        }
        await this.cardStore.save(newCard);
    }*/

    public async getByCardNumber(cardNumber: string) {
        return await this.cardStore.findOne({
            where: {
                cardNumber: cardNumber
            }
        });
    }

    public async getByBank(bankId: number) {
        return await this.cardStore.find({
            where: {
                issuer: {
                    id: bankId
                }
            },
            relations: [ "issuer" ] // Explicitly load the `issuer` relation
        });
    }

    public async getUserCards(userId: number) {
        return await this.cardStore.find({
            where: {
                owner: {
                    id: userId
                }
            },
            relations: [ "owner" ] // Explicitly load the `owner` relation
        });
    }
}

const cardController = new CardController();

export default cardController;
