import { C2E_COLLECTION_TYPE } from "../constants";
import C2eContentDocumentLd from "./C2eContentDocumentLd";
import JsonLinkedData from "./JsonLinkedData";

class C2eContentDocumentCollectionLd extends JsonLinkedData {
    private c2eContentDocuments: Array<C2eContentDocumentLd> = [];
    private counter: number = 0;

    constructor() {
        const identifier = 'c2ens:c2eContents';
        const type = C2E_COLLECTION_TYPE;
        super(identifier, type);
    }

    incrementCounter(): void {
        this.counter++;
    }

    getCounter(): number {
        return this.counter;
    }

    addC2eContentDocument(c2eContentDocument: C2eContentDocumentLd): C2eContentDocumentLd | undefined {
        this.incrementCounter();
        c2eContentDocument.setIndex(this.getCounter());
        this.c2eContentDocuments.push(c2eContentDocument);
        return c2eContentDocument;
    }

    getC2eContentDocuments(): C2eContentDocumentLd[] {
        return this.c2eContentDocuments;
    }

    toJsonLd(): Object {
        return {
            "@id": this.getIdentifier(),
            "@type": this.getType(),
            c2eContents: this.getC2eContentDocuments().map((c2eContentDocument: C2eContentDocumentLd) => {
                return c2eContentDocument.toJsonLd();
            })
        };
    }
}

export default C2eContentDocumentCollectionLd;