interface C2eContentTypeAttribute {
    name: string;
    type: string;

    setName(name: string): void;
    getName(): string;
    setType(type: string): void;
    getType(): string | undefined;
    toJsonLd(): Object;
}

export default C2eContentTypeAttribute;