import JsonLd from "./JsonLd";

interface C2eDigitalDocument extends JsonLd {
  url: string;
  fileFormate: string;
  mediaIdentifier: string | undefined,
  mediaIdentifierType: string | undefined

  setUrl(url: string): void;
  getUrl(): string;
  setFileFormate(fileFormate: string): void;
  getFileFormate(): string;

  setMediaIdentifier(mediaIdentifierType: string): void;
  getMediaIdentifier(): string | undefined;

  setMediaIdentifierType(mediaIdentifierType: string): void;
  getMediaIdentifierType(): string | undefined;
}

export default C2eDigitalDocument;
