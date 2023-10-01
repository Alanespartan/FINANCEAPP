export interface Bank {
    name: string;
    // contact information
    country: string;
    phone: string;
}

export interface CardOptions {
    cardNumber: string;
    holderName: string;
    expires: Date;
    issuer: Bank;
    balance: number;
}

export interface MSIOptions {
    useMsi: boolean;
    months: number;
}