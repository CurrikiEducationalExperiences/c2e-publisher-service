import C2eMdLifecycle from "../interfaces/C2eMdLifecycle";
import JsonLinkedData from "./JsonLinkedData";

export default class C2eMdLifecycleLd extends JsonLinkedData implements C2eMdLifecycle {
    version: string;
    releaseStatus: string;

    constructor(c2eId: string, type: string, version: string, releaseStatus: string) {
        const identifier = 'c2ens:c2eid-' + c2eId + '/metadata/lifecycle';
        super(identifier, type);
        this.version = version;
        this.releaseStatus = releaseStatus;
    }

    setVersion(version: string): void {
        this.version = version;
    }
    getVersion(): string {
        return this.version;
    }
    setReleaseStatus(releaseStatus: string): void {
        this.releaseStatus = releaseStatus;
    }
    getReleaseStatus(): string {
        return this.releaseStatus;
    }

    toJsonLd(): Object {
        return {
            "@id": this.getIdentifier(),
            "@type": this.getType(),
            version: this.getVersion(),
            releaseStatus: this.getReleaseStatus(),
        };
    }
}
