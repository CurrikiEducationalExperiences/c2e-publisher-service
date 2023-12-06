interface JsonLd {
  identifier: string;
  type: string;

  setIdentifier(identifier: string): void;
  getIdentifier(): string | undefined;
  setType(type: string): void;
  getType(): string | undefined;
  toJsonLd(): Object;
}

export default JsonLd;