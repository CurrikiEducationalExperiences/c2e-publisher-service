import JsonLd from "./JsonLd";

interface C2eEmbed extends JsonLd {
    subManifestUrl: string;
    setSubManifestUrl(subManifestUrl: string): void;
    getSubManifestUrl(): string;
}

export default C2eEmbed;