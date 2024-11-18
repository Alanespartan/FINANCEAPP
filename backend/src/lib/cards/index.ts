import { Card } from "./Card";
import { DebitCard } from "./DebitCard";
import { CreditCard } from "./CreditCard";

type AvailableCards = DebitCard | CreditCard;

export {
    Card,
    DebitCard,
    CreditCard,
    AvailableCards
};
