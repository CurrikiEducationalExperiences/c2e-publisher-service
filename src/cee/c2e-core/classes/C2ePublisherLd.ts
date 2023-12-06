import {C2E_ORGANIZATION_TYPE} from '../constants';
import C2ePersona from '../interfaces/C2ePersona';
import JsonLinkedData from './JsonLinkedData';

export default class C2ePublisherLd extends JsonLinkedData implements C2ePersona {
    name: string;
    email: string;
    url: string;

    constructor(c2eId: string, type: string = C2E_ORGANIZATION_TYPE, name: string = '', email: string = '', url: string = '') {
        const identifier = 'c2ens:c2eid-' + c2eId + '/publisher/id/' + email;
        super(identifier, type);
        this.name = name;
        this.email = email;
        this.url = url;
    }

    setName(name: string): void {
        this.name = name;
    }
    getName(): string | undefined {
        return this.name;
    }
    setEmail(email: string): void {
        this.email = email;
    }
    getEmail(): string | undefined {
        return this.email;
    }
    setUrl(url: string): void {
        this.url = url;
    }
    getUrl(): string | undefined {
        return this.url;
    }

    toJsonLd(): Object {
        return {
            "@id": this.getIdentifier(),
            "@type": this.getType(),
            name: this.getName(),
            email: this.getEmail(),
            url: this.getUrl(),
        };
    }
}
