import { Entity, PrimaryColumn, Column } from "typeorm";
import { IBank } from "@common/types/util";

@Entity()
export class Bank implements IBank {
    @PrimaryColumn()
    public id!: number;
    @Column()
    public name!: string;
    @Column()
    public country!: string;

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    public constructor(name?: string, country?: string) {
        if(name && country) {
            this.name = name;
            this.country = country;
        }
    }
}
