import JsonLd from "./JsonLd";

export default interface C2ePersona extends JsonLd {
    name: string;
    email: string;
    url: string;
    
    setName(name: string): void;
    getName(): string | undefined;
    setEmail(email: string): void;
    getEmail(): string | undefined;
    setUrl(url: string): void;
    getUrl(): string | undefined;
}