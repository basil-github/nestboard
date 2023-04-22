export declare class FelidType {
    static types: Attributes[];
    static getModal(type: string, name: string, enums: string): string;
    static restructure(attributes: {
        type: string;
        name: string;
        enum: string;
    }[]): string[];
    static allTypes(): {
        type: string;
    }[];
}
export type Attributes = {
    type: string;
    modal: string;
};
