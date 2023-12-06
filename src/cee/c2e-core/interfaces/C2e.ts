import C2eContainer from "./C2eContainer";
import C2eMetadata from "./C2eMetadata";
import JsonLd from "./JsonLd";

export default interface C2e extends JsonLd {
    creativeWorkStatus: string;
    c2eMetadata: C2eMetadata | undefined;
    c2eContainer: C2eContainer | undefined;

    setCreativeWorkStatus(creativeWorkStatus: string): void;
    getCreativeWorkStatus(): string;

    setC2eMetadata(c2eMetadata: C2eMetadata): void;
    getC2eMetadata(): C2eMetadata | undefined;

    setC2eContainer(c2eContainer: C2eContainer): void;
    getC2eContainer(): C2eContainer | undefined;
}
