import C2eContentTypeAttribute from "../interfaces/C2eContentTypeAttribute";

export default class C2eContentTypeAttributeLd implements C2eContentTypeAttribute {
    name: string;
    type: string;

    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }

    setName(name: string): void {
        this.name = name;
    }
    
    getName(): string {
        return this.name;
    }

    setType(type: string): void {
        this.type = type;
    }

    getType(): string | undefined {
        return this.type;
    }

    toJsonLd(): Object {
        return {
            name: this.getName(),
            type: this.getType()
        };
    }
}