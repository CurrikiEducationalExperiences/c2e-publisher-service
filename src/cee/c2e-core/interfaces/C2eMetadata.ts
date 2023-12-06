import C2eCreativeWork from './C2eCreativeWork';
import C2eMdCopyright from "./C2eMdCopyright";
import C2eMdGeneral from "./C2eMdGeneral";
import C2eMdLifecycleLd from "./C2eMdLifecycleLd";
import C2ePersona from "./C2ePersona";
import JsonLd from "./JsonLd";

export default interface C2eMetadata extends JsonLd {
    schemaVersion: string | undefined;
    general: C2eMdGeneral | undefined;
    author: C2ePersona | undefined;
    copyright: C2eMdCopyright | undefined;
    publisher: C2ePersona | undefined;
    lifecycle: C2eMdLifecycleLd | undefined;

    setSchemaVersion(schemaVersion: string): void;
    getSchemaVersion(): string | undefined;

    setC2eMdGeneralLd(general: C2eMdGeneral): void;
    getC2eMdGeneralLd(): C2eMdGeneral | undefined;

    setC2eMdSubjectOfLd(general: C2eCreativeWork): void;
    getC2eMdSubjectOfLd(): C2eCreativeWork | undefined;

    setC2eAuthorLd(author: C2ePersona): void;
    getC2eAuthorLd(): C2ePersona | undefined;

    setC2eMdCopyrightLd(copyrights: C2eMdCopyright): void;
    getC2eMdCopyrightLd(): C2eMdCopyright | undefined;

    setC2ePublisherLd(publisher: C2ePersona): void;
    getC2ePublisherLd(): C2ePersona | undefined;

    setC2eLifecycleLd(lifecycle: C2eMdLifecycleLd): void;
    getC2eLifecycleLd(): C2eMdLifecycleLd | undefined

}
