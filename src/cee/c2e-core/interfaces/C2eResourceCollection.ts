import JsonLd from "./JsonLd";
import C2eDigitalDocument from './C2eDigitalDocument';

export interface C2eResourceCollection extends JsonLd {
    c2eResources: Array<C2eDigitalDocument>;
    addC2eResource(c2eDigitalDocument: C2eDigitalDocument): void;
    removeC2eResource(c2eDigitalDocument: C2eDigitalDocument): void;
    getC2eResources(): Array<C2eDigitalDocument>;
}

export default C2eResourceCollection;