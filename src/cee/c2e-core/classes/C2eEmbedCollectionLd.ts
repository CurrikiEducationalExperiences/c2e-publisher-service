import C2eEmbed from "../interfaces/C2eEmbed";
import C2eEmbedCollection from "../interfaces/C2eEmbedCollection";
import JsonLinkedData from "./JsonLinkedData";

class C2eEmbedCollectionLd extends JsonLinkedData implements C2eEmbedCollection {
    c2eEmbeds: Array<C2eEmbed>;

    constructor (identifier: string, type: string, c2eEmbed: C2eEmbed) {
        super(identifier, type);
        this.c2eEmbeds = [c2eEmbed];
    }

    addC2eEmbed(c2eEmbed: C2eEmbed): void {
        this.c2eEmbeds.push(c2eEmbed);    
    }

    removeC2eEmbed(c2eEmbed: C2eEmbed): void {
        this.c2eEmbeds = this.c2eEmbeds.filter((c2eEmbedItem) => c2eEmbedItem.getIdentifier() !== c2eEmbed.getIdentifier());
    }

    getC2eEmbeds(): Array<C2eEmbed> {
        return this.c2eEmbeds;
    }
}