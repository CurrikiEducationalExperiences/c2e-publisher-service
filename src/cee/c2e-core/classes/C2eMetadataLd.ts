// create a new class name C2eMetadata which implements metadata interface
import C2eCreativeWork from '../interfaces/C2eCreativeWork';
import C2eMdCopyright from "../interfaces/C2eMdCopyright";
import C2eMdGeneral from "../interfaces/C2eMdGeneral";
import C2eMdLifecycleLd from "../interfaces/C2eMdLifecycleLd";
import C2eMetadata from "../interfaces/C2eMetadata";
import C2ePersona from "../interfaces/C2ePersona";
import JsonLinkedData from "./JsonLinkedData";

class C2eMetadataLd extends JsonLinkedData implements C2eMetadata {
    schemaVersion: string | undefined;
    general: C2eMdGeneral | undefined;
    author: C2ePersona | undefined;
    copyright: C2eMdCopyright | undefined;
    publisher: C2ePersona | undefined;
    lifecycle: C2eMdLifecycleLd | undefined;
    subjectOf: C2eCreativeWork | undefined;

    constructor(c2eId: string, type: string, general?: C2eMdGeneral | undefined, subjectOf?: C2eCreativeWork | undefined, author?: C2ePersona | undefined, copyright?: C2eMdCopyright | undefined, schemaVersion?: string | undefined, publisher?: C2ePersona | undefined, lifecycle?: C2eMdLifecycleLd | undefined) {
        const identifier = 'c2ens:c2eid-' + c2eId + '/metadata';
        super(identifier, type);
        this.schemaVersion = schemaVersion;
        this.general = general;
        this.author = author;
        this.copyright = copyright;
        this.publisher = publisher;
        this.lifecycle = lifecycle;
        this.subjectOf = subjectOf
    }

    setSchemaVersion(schemaVersion: string): void {
        this.schemaVersion = schemaVersion;
    }

    getSchemaVersion(): string | undefined {
        return this.schemaVersion;
    }


    setC2eMdGeneralLd(general: C2eMdGeneral): void {
        this.general = general;
    }

    getC2eMdGeneralLd(): C2eMdGeneral | undefined {
        return this.general;
    }

    setC2eMdSubjectOfLd(subjectOf: C2eCreativeWork): void {
        this.subjectOf = subjectOf;
    }

    getC2eMdSubjectOfLd(): C2eCreativeWork | undefined {
        return this.subjectOf;
    }

    setC2eAuthorLd(author: C2ePersona): void {
        this.author = author;
    }
    getC2eAuthorLd(): C2ePersona | undefined {
        return this.author;
    }

    setC2eMdCopyrightLd(copyright: C2eMdCopyright): void {
        this.copyright = copyright;
    }
    getC2eMdCopyrightLd(): C2eMdCopyright | undefined {
        return this.copyright
    }

    setC2ePublisherLd(publisher: C2ePersona): void {
        this.publisher = publisher;
    }
    getC2ePublisherLd(): C2ePersona | undefined {
        return this.publisher;
    }

    setC2eLifecycleLd(lifecycle: C2eMdLifecycleLd): void {
        this.lifecycle = lifecycle;
    }
    getC2eLifecycleLd(): C2eMdLifecycleLd | undefined {
        return this.lifecycle;
    }

    toJsonLd(): Object {
        const publisherJsonLd = this.getC2ePublisherLd() ? this.getC2ePublisherLd()?.toJsonLd() : undefined;
        const lifecycle = this.getC2eLifecycleLd ? this.getC2eLifecycleLd()?.toJsonLd() : undefined;

        const metadata = {
            "@id": this.getIdentifier(),
            "@type": this.getType(),
            schemaVersion: this.getSchemaVersion(),
            general: this.getC2eMdGeneralLd()?.toJsonLd(),
            subjectOf: this.getC2eMdSubjectOfLd()?.toJsonLd(),
            author: this.getC2eAuthorLd()?.toJsonLd(),
            publisher: publisherJsonLd,
            lifecycle: lifecycle,
            copyright: this.getC2eMdCopyrightLd()?.toJsonLd(),
        };

        if (publisherJsonLd === undefined) {
            delete metadata.publisher;
        }

        if (lifecycle === undefined) {
            delete metadata.lifecycle;
        }

        return metadata;
    }
}

export default C2eMetadataLd;
