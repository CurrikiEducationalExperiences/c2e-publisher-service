import { C2E_DIGITAL_DOCUMENT_TYPE } from "../constants";
import C2eDigitalDocumentLd from "./C2eDigitalDocumentLd";

class C2eContentDocumentLd extends C2eDigitalDocumentLd {
    private learningResourceType: string;
    private index: number = 0;
    private isPartOfProp: string = '';

    constructor(c2eId: string, contentType: string, url: string, fileFormate: string, index: number = 0) {     
        super(c2eId, C2E_DIGITAL_DOCUMENT_TYPE, url, fileFormate);
        const identifierUri = 'c2ens:c2eid-' + c2eId + '/content/' + url;
        this.setIdentifier(identifierUri);
        this.setUrl(url);
        this.setFileFormate(fileFormate);
        this.learningResourceType = contentType;
        this.index = index;
    }

    setUrl(url: string): void {
        this.url = '/content/' + url;
    }

    setIndex(index: number): void {
        this.index = index;
    }
    
    getIndex(): number {
        return this.index;
    }

    isPartOf(c2eContentId: string): void {
        this.isPartOfProp = c2eContentId;
    }

    getIsPartOf(): string {
        return this.isPartOfProp;
    }

    getLearningResourceType(): string {
        return this.learningResourceType;
    }
    
    toJsonLd(): Record<string, any> {
        const c2eContentDocument: Record<string, any> = {
            "@id": this.getIdentifier(),
            "@type": this.getType(),
            "@index": this.getIndex().toString(),
            url: this.getUrl(),
            fileFormate: this.getFileFormate(),
            learningResourceType: this.learningResourceType
        };

        if (this.getIsPartOf()) {
            c2eContentDocument.isPartOf = this.getIsPartOf();
        }
        
        return c2eContentDocument;
    }

}

export default C2eContentDocumentLd;