import JsonLd from "./JsonLd";

export default interface C2eCreativeWork extends JsonLd {
    name: string;

    setName(title: string): void;
    getName(): string;
}
