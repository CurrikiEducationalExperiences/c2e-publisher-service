import C2eEmbed from "../interfaces/C2eEmbed";
import JsonLinkedData from "./JsonLinkedData";

class C2eEmbedLd extends JsonLinkedData implements C2eEmbed {
    subManifestUrl: string;

    constructor(identifier: string, type: string, subManifestUrl: string) {
        super(identifier, type);
        this.subManifestUrl = subManifestUrl;
    }

    setSubManifestUrl(subManifestUrl: string): void {
        this.subManifestUrl = subManifestUrl;
    }
    getSubManifestUrl(): string {
        return this.subManifestUrl;
    }

}

export default C2eEmbedLd;