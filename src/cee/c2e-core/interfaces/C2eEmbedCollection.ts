import C2eEmbed from "./C2eEmbed";
import JsonLd from "./JsonLd";

interface C2eEmbedCollection extends JsonLd {
    c2eEmbeds: Array<C2eEmbed>;

    addC2eEmbed(c2eEmbed: C2eEmbed): void;
    removeC2eEmbed(c2eEmbed: C2eEmbed): void;
    getC2eEmbeds(): Array<C2eEmbed>
}

export default C2eEmbedCollection;