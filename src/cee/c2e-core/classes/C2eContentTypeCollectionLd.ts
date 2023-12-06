import C2eContentType from "../interfaces/C2eContentType";
import C2eContentTypeCollection from "../interfaces/C2eContentTypeCollection";
import JsonLinkedData from "./JsonLinkedData";

export default class C2eContentTypeCollectionLd extends JsonLinkedData implements C2eContentTypeCollection {
    c2eContentTypes: Array<C2eContentType> = [];

    constructor(identifier: string, type: string) {
        super(identifier, type);
    }

    addC2eContentType(c2eContentType: C2eContentType): void {
        this.c2eContentTypes.push(c2eContentType);
    }

    removeC2eContentType(c2eContentType: C2eContentType): void {
        this.c2eContentTypes = this.c2eContentTypes.filter((c2eContentTypeItem: C2eContentType) => {
            return c2eContentTypeItem.getIdentifier() !== c2eContentType.getIdentifier();
        });    
    }

    getC2eContentTypes(): Array<C2eContentType> | undefined {
        return this.c2eContentTypes;
    }
    
    toJsonLd() : Object {
        return {
            "@id": this.getIdentifier(),
            "@type": this.getType(),
            c2eContentTypes : this.getC2eContentTypes()?.map((c2eContentType: C2eContentType) => {
                return c2eContentType.toJsonLd();
            })
        };
    }
}