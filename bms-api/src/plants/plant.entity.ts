import { RecordBase } from "src/RecordBase";
import { AfterInsert, AfterLoad, AfterUpdate, Column, Entity } from "typeorm";

@Entity()
export class Plant extends RecordBase {
    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    purchasePrice: number;

    @Column({ nullable: true })
    sellPrice: number;

    protected margin: number;
    protected ROI: number;

    @AfterLoad()
    @AfterInsert()
    @AfterUpdate()
    generateMargin(): void {
        this.margin = this.sellPrice - this.purchasePrice;
    }

    @AfterLoad()
    @AfterInsert()
    @AfterUpdate()
    generateROI(): void {
        if (this.purchasePrice != null && this.purchasePrice != 0) {
            this.ROI = this.margin / this.purchasePrice;
        }
    }
}