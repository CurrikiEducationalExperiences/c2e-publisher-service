import JsonLd from "./JsonLd";

export default interface C2eMdGeneral extends JsonLd {
    title: string;
    description: string;
    keywords: Array<string>;

    setTitle(title: string): void;
    getTitle(): string | undefined;
    setDescribtion(description: string): void;
    getDescribtion(): string | undefined;
    addKeyword(keyword: string): void;
    removeKeyword(keyword: string): void;
    getKeywords(): Array<string> | undefined;
}