import C2eContentDocumentLd from "./C2eContentDocumentLd";
import JsonLinkedData from "./JsonLinkedData";

// 'C2eContent' class take Record<string, any> as contructor parameter. This also have function toJsonLd() that return Record<string, any>.
class C2eContentLd extends JsonLinkedData {
    private c2eContent: Record<string, any>;
    constructor (c2eContent: Record<string, any>, c2eContentDocument: C2eContentDocumentLd | undefined) {
        super(c2eContentDocument?.getIdentifier()!, 'c2ens:' + c2eContentDocument?.getLearningResourceType());
        this.c2eContent = c2eContent;
    }

    toJsonLd (): Record<string, any> {
        const c2eContent: Record<string, any> = this.c2eContent;
        return {
            "@id": this.getIdentifier(), 
            "@type": this.getType(),
            ...c2eContent
        };
    }
}

export default C2eContentLd;