import JsonLd from "./JsonLd";
import C2eDigitalDocument from "./C2eDigitalDocument";

interface C2eSourceCode extends JsonLd {
    script: C2eDigitalDocument;
    html: C2eDigitalDocument;

    setScript(script: C2eDigitalDocument): void;
    getScript(): C2eDigitalDocument;
    setHtml(html: C2eDigitalDocument): void;
    getHtml(): C2eDigitalDocument;
}

export default C2eSourceCode;