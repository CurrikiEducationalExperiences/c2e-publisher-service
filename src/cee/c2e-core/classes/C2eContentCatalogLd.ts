import {C2E_DATA_CATALOG_TYPE, C2E_DIGITAL_DOCUMENT_TYPE} from "../constants";
import C2eDigitalDocument from "../interfaces/C2eDigitalDocument";
import JsonLinkedData from "./JsonLinkedData";

class C2eContentCatalogLd extends JsonLinkedData implements C2eDigitalDocument {
    url: string;
    fileFormate: string;

    constructor(
        c2eId: string,
        public mediaIdentifier: string | undefined = undefined,
        public mediaIdentifierType: string | undefined = undefined
    ) {
        const type = C2E_DIGITAL_DOCUMENT_TYPE;
        const fileFormate = 'application/json';
        const identifierUri = 'c2ens:c2eid-' + c2eId + '/content/contents.json';
        super(identifierUri, type);
        this.url = '/content/contents.json';
        this.fileFormate = fileFormate;
    }

    setMediaIdentifier(identifier: string): void {
        this.mediaIdentifier = identifier;
    }
    getMediaIdentifier(): string | undefined {
        return this.mediaIdentifier;
    }

    setMediaIdentifierType(mediaIdentifierType: string): void {
        this.mediaIdentifierType = mediaIdentifierType;
    }

    getMediaIdentifierType(): string | undefined {
        return this.mediaIdentifierType;
    }

    setUrl(url: string): void {
        this.url = '/content/' + url;
    }

    getUrl(): string {
        return this.url;
    }

    setFileFormate(fileFormate: string): void {
        this.fileFormate = fileFormate;
    }

    getFileFormate(): string {
        return this.fileFormate;
    }

    toJsonLd(): Object {
        return {
            "@id": "c2ens:c2eContentCatalog",
            "@type": C2E_DATA_CATALOG_TYPE,
            c2eContentCatalog: {
                "@id": this.getIdentifier(),
                "@type": this.getType(),
                url: this.getUrl(),
                fileFormate: this.getFileFormate(),
            }
        };
    }
}

export default C2eContentCatalogLd;
