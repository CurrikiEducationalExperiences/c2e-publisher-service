import C2eDigitalDocument from "../interfaces/C2eDigitalDocument";
import C2eResourceCollection from "../interfaces/C2eResourceCollection";
import JsonLinkedData from "./JsonLinkedData";

export default class C2eResourceCollectionLd extends JsonLinkedData implements C2eResourceCollection {
    c2eResources: Array<C2eDigitalDocument> = [];

    constructor(identifier: string, type: string) {
      super(identifier, type);
    }
    
    addC2eResource(c2eDigitalDocument: C2eDigitalDocument): C2eDigitalDocument {
      this.c2eResources.push(c2eDigitalDocument);
      return c2eDigitalDocument;
    }
  
    removeC2eResource(c2eDigitalDocument: C2eDigitalDocument): void {
      this.c2eResources = this.c2eResources.filter(resource => resource.getIdentifier() !== c2eDigitalDocument.getIdentifier());
    }
  
    getC2eResources(): Array<C2eDigitalDocument> {
      return this.c2eResources;
    }

    toJsonLd(): Object {
      return {
        "@id": this.getIdentifier(),
        "@type": this.getType(),
        c2eResources: this.c2eResources.map(c2eDigitalDocument => c2eDigitalDocument.toJsonLd())
      };
    }

  }

