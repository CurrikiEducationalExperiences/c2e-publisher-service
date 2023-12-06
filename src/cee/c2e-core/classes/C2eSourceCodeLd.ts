import C2eSourceCode from "../interfaces/C2eSourceCode";
import JsonLinkedData from "./JsonLinkedData";
import C2eDigitalDocument from "../interfaces/C2eDigitalDocument";

class C2eSourceCodeLd extends JsonLinkedData implements C2eSourceCode {
    script: C2eDigitalDocument;
    html: C2eDigitalDocument;

    constructor(identifier: string, type: string, html: C2eDigitalDocument, script: C2eDigitalDocument) {
        super(identifier, type);
        this.script = script;
        this.html = html;
    }

    setScript(script: C2eDigitalDocument): void {
        this.script = script;
    }

    getScript(): C2eDigitalDocument {
        return this.script;
    }

    setHtml(html: C2eDigitalDocument): void {
        this.html = html;
    }

    getHtml(): C2eDigitalDocument {
        return this.html;
    }

    toJsonLd(): Object {
        return {
            "@id": this.getIdentifier(),
            "@type": this.getType(),
            c2eSourceCode: [
                this.getScript().toJsonLd(),
                this.getHtml().toJsonLd(),
            ]
        };
    }
}

export default C2eSourceCodeLd;