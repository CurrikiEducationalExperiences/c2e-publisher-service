import C2eContentType from "./C2eContentType";
import JsonLd from "./JsonLd";

interface C2eContentTypeCollection extends JsonLd {
    c2eContentTypes: Array<C2eContentType>;
    addC2eContentType(c2eContentType: C2eContentType): void;
    removeC2eContentType(c2eContentType: C2eContentType): void;
    getC2eContentTypes(): Array<C2eContentType> | undefined;

}

export default C2eContentTypeCollection;