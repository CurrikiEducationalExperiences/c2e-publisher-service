import C2eDigitalDocument from "../interfaces/C2eDigitalDocument";
import JsonLinkedData from "./JsonLinkedData";

class C2eDigitalDocumentLd extends JsonLinkedData implements C2eDigitalDocument {
    url: string;
    fileFormate: string;

    constructor(
        c2eId: string,
        type: string,
        url: string,
        fileFormate: string,
        public mediaIdentifier: string | undefined = undefined,
        public mediaIdentifierType: string | undefined = undefined
    ) {
        const identifierUri = 'c2ens:c2eid-' + c2eId + '/resources/' + url;
        super(identifierUri, type);
        this.url = '/resources/' + url;
        this.fileFormate = fileFormate;
    }

    setUrl(url: string): void {
        this.url = '/resources/' + url;
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

    setIdentifier(identifier: string): void {
        this.identifier = identifier;
    }

    getIdentifier(): string | undefined {
        return this.identifier;
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

    toJsonLd(): Object {
        let jsonLd = {
            "@id": this.getIdentifier(),
            "@type": this.getType(),
            url: this.getUrl(),
            fileFormate: this.getFileFormate()
        };

        if (this.mediaIdentifier && this.mediaIdentifierType) {
            jsonLd = Object.assign({...jsonLd}, {
                identifier: {
                    "@type": 'sdons:PropertyValue',
                    propertyID: this.mediaIdentifierType,
                    value: this.mediaIdentifier
                }
            });
        }

        return jsonLd;
    }
}

export default C2eDigitalDocumentLd;
