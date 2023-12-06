import C2eDigitalDocumentLd from "./C2eDigitalDocumentLd";

class C2eSourceCodeDocumentLd extends C2eDigitalDocumentLd {
    constructor(c2eId: string, url: string, fileFormate: string) {     
        const type = 'sdons:SoftwareSourceCode';
        super(c2eId, type, url, fileFormate);
        const identifierUri = 'c2ens:c2eid-' + c2eId + '/source/' + url;
        this.setIdentifier(identifierUri);
        this.setUrl(url);
        this.setFileFormate(fileFormate);
    }

    setUrl(url: string): void {
        this.url = '/source/' + url;
    }
}

export default C2eSourceCodeDocumentLd;