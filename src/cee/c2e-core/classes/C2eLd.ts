import {C2E_CollectionPage_TYPE} from '../constants';
import C2e from "../interfaces/C2e";
import C2eBreadcrumbList from '../interfaces/C2eBreadcrumbList';
import C2eContainer from "../interfaces/C2eContainer";
import C2eMetadata from "../interfaces/C2eMetadata";
import JsonLinkedData from "./JsonLinkedData";

class C2eLd extends JsonLinkedData implements C2e {
    c2eMetadata: C2eMetadata | undefined;
    c2eContainer: C2eContainer | undefined;
    c2eBreadcrumb: C2eBreadcrumbList;

    constructor(
        c2eId: string,
        type: string,
        c2eMetadata?: C2eMetadata | undefined,
        c2eContainer?: C2eContainer | undefined,
        public creativeWorkStatus: string = 'published'
    ) {
        const identifier = 'c2ens:c2eid-' + c2eId;
        super(identifier, type);
        this.c2eMetadata = c2eMetadata;
        this.c2eContainer = c2eContainer;
    }

    // set and get c2eBreadcrumb
    setC2eBreadcrumb(c2eBreadcrumb: C2eBreadcrumbList): void {
        this.c2eBreadcrumb = c2eBreadcrumb;
    }

    getC2eBreadcrumb(): C2eBreadcrumbList {
        return this.c2eBreadcrumb;
    }

    // set and get creativeWorkStatus
    setCreativeWorkStatus(creativeWorkStatus: string): void {
        this.creativeWorkStatus = creativeWorkStatus;
    }

    getCreativeWorkStatus(): string {
        return this.creativeWorkStatus;
    }

    setC2eMetadata(c2eMetadata: C2eMetadata): void {
        this.c2eMetadata = c2eMetadata;
    }

    getC2eMetadata(): C2eMetadata | undefined {
        return this.c2eMetadata;
    }

    setC2eContainer(c2eContainer: C2eContainer): void {
        this.c2eContainer = c2eContainer;
    }

    getC2eContainer(): C2eContainer | undefined {
        return this.c2eContainer;
    }

    toJsonLd(): Object {
        return {
            "@context": "/resources/c2e-context.jsonld",
            "@id": this.getIdentifier(),
            "@type": this.getType(),
            creativeWorkStatus: this.getCreativeWorkStatus(),
            c2eMetadata: this.c2eMetadata?.toJsonLd(),
            c2eContainer: this.c2eContainer?.toJsonLd(),
            archivedAt: {
                "@id": this.identifier + '/C2ECollections',
                "@type": C2E_CollectionPage_TYPE,
                name: "C2E Collections",
                breadcrumb: this.c2eBreadcrumb?.toJsonLd()
            }
        };
    }
}

export default C2eLd;
