import C2eCreativeWork from '../interfaces/C2eCreativeWork';
import JsonLinkedData from "./JsonLinkedData";

export default class C2eMdSubjectOfLd extends JsonLinkedData implements C2eCreativeWork {
    name: string;
    constructor(c2eId: string, type: string, name: string) {
        const identifier = 'c2ens:c2eid-' + c2eId + '/metadata/subjectOf';
        super(identifier, type);
        this.name = name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    toJsonLd(): Object {
        return {
            "@id": this.getIdentifier(),
            "@type": this.getType(),
            name: this.getName(),
        };
    }
}
