import C2eMdGeneral from "../interfaces/C2eMdGeneral";
import JsonLinkedData from "./JsonLinkedData";

export default class C2eMdGeneralLd extends JsonLinkedData implements C2eMdGeneral {
    title: string;
    description: string;
    keywords: Array<string>;

    constructor(c2eId: string, type: string, title: string, description: string, keywords: Array<string>) {
        const identifier = 'c2ens:c2eid-' + c2eId + '/metadata/general';
        super(identifier, type);
        this.title = title;
        this.description = description;
        this.keywords = keywords;
    }

    setTitle(title: string): void {
        this.title = title;
    }

    getTitle(): string {
        return this.title;
    }

    setDescribtion(description: string): void {
        this.description = description;
    }

    getDescribtion(): string | undefined {
        return this.description;
    }

    addKeyword(keyword: string): void {
        this.keywords.push(keyword);
    }

    removeKeyword(keyword: string): void {
        this.keywords = this.keywords.filter((item) => item !== keyword);
    }

    getKeywords(): string[] | undefined {
        return this.keywords;
    }

    toJsonLd(): Object {
        return {
            "@id": this.getIdentifier(),
            "@type": this.getType(),
            title: this.getTitle(),
            description: this.getDescribtion(),
            keywords: this.getKeywords(),
        };
    }
}