import C2eResourceCollection from "./C2eResourceCollection";
import C2eContentTypeCollection from './C2eContentTypeCollection';
import C2eEmbedCollection from "./C2eEmbedCollection";
import C2eSourceCode from "./C2eSourceCode";
import C2eDigitalDocument from "./C2eDigitalDocument";

export default interface C2eContainer {
    c2eResourceCollection: C2eResourceCollection;
    c2eContentTypeCollection: C2eContentTypeCollection;
    c2eEmbedCollection?: C2eEmbedCollection;
    c2eSourceCode: C2eSourceCode;
    c2eContents?: C2eDigitalDocument | undefined;
    toJsonLd(): Array<Object>;
}