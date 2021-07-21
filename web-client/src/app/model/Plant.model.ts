import { RecordBase } from "./RecordBase";

export class Plant extends RecordBase {
    id: number;
    name: string;
    description: string;
    purchasePrice: number;
    sellPrice: number;
    margin: number;
    ROI: number;
}