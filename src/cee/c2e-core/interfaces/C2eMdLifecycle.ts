import JsonLd from "./JsonLd";

export default interface C2eMdLifecycle extends JsonLd {
    version: string;
    releaseStatus: string;

    setVersion(version: string): void;
    getVersion(): string;

    setReleaseStatus(releaseStatus: string): void;
    getReleaseStatus(): string;
}