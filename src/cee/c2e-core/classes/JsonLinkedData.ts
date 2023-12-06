// make 'JsonLd' class which implements 'JsonLd' interface
import JsonLd from "../interfaces/JsonLd";

class JsonLinkedData implements JsonLd {
    identifier: string;
    type: string;

    constructor (identifier: string, type: string) {
        this.identifier = identifier;
        this.type = type;
    }

    setIdentifier(identifier: string): void {
        this.identifier = identifier;
    }

    getIdentifier(): string | undefined {
        return this.identifier;    
    }

    setType(type: string): void {
        this.type = type;
    }

    getType(): string | undefined {
        return this.type;
    }

    toJsonLd(): Object {
        return {
            "@id": this.identifier,
            "@type": this.type,
        };
    }
}

export default JsonLinkedData;