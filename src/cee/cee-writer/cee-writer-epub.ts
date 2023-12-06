import {ReadStream} from 'fs';
import * as path from 'path';
import {Cee} from "../../models/cee.model";
import {C2E_PERSON_TYPE, INTEGER_TYPE, STRING_TYPE} from "../c2e-core/constants";
import C2ePersona from "../c2e-core/interfaces/C2ePersona";
import C2eWriter from "../c2e-core/writer/C2eWriter";

export class CeeWriterEpub {

  private c2eManifest: Object = {};
  private skipC2ePackage: boolean = false;
  private licenseType: string = '';
  private licenseTerms: string = '';
  private licensePrice: string = '';
  private licenseIdentifier: string = '';
  private licenseDateCreated: string = '';
  private licenseExpires: string = '';
  private keywords: string[] = [];
  private breadcrumb: string[] = [];

  constructor(
    private storageDirectory: string,
    private c2eMediaFile: string,
    private c2eMediaMimetype: string,
    private cee: Cee,
    private licensee: C2ePersona,
    private copyrightHolder: C2ePersona,
    private pulisher: C2ePersona,
    private c2eSubjectOfName: string = '',
    private c2eMediaIdentifier: string = '',
    private c2eMediaIdentifierType: string = '',
    private c2eStatus: string = 'published',
  ) { }

  setBreadcrumb(breadcrumb: string[]): void {
    this.breadcrumb = breadcrumb;
  }

  getBreadcrumb(): string[] {
    return this.breadcrumb;
  }

  setKeywords(keywords: string[]): void {
    this.keywords = keywords;
  }
  getKeywords(): string[] {
    return this.keywords;
  }

  setLicenseExpires(licenseExpires: string): void {
    this.licenseExpires = licenseExpires;
  }

  setLicenseDateCreated(licenseDateCreated: string): void {
    this.licenseDateCreated = licenseDateCreated;
  }

  setLicenseIdentifier(licenseIdentifier: string): void {
    this.licenseIdentifier = licenseIdentifier;
  }

  setLicensePrice(licensePrice: string): void {
    this.licensePrice = licensePrice;
  }

  setLicenseType(licenseType: string): void {
    this.licenseType = licenseType;
  }

  getLicenseType(): string {
    return this.licenseType;
  }

  setLicenseTerms(licenseTerms: string): void {
    this.licenseTerms = licenseTerms;
  }

  getLicenseTerms(): string {
    return this.licenseTerms;
  }

  // set and get c2eManifest
  setC2eManifest(c2eManifest: Object): void {
    this.c2eManifest = c2eManifest;
  }

  getC2eManifest(): Object {
    return this.c2eManifest;
  }

  setSkipC2ePackage(skipC2ePackage: boolean): void {
    this.skipC2ePackage = skipC2ePackage;
  }

  getSkipC2ePackage(): boolean {
    return this.skipC2ePackage;
  }

  write(): ReadStream | Boolean {
    // ===== C2E Writer =====
    const c2eId = this.cee.id;
    const c2eWriter = new C2eWriter(c2eId, this.c2eStatus);

    const c2eMediaStoragePath = this.storageDirectory;
    const c2eStoragePath = path.join(this.storageDirectory, '/');
    const c2eMediaFileStoragePath = path.join(c2eMediaStoragePath, '/', this.c2eMediaFile);

    c2eWriter.createC2eResource(
      c2eMediaFileStoragePath,
      this.c2eMediaFile,
      this.c2eMediaMimetype,
      this.c2eMediaIdentifier,
      this.c2eMediaIdentifierType
    );
    // Define C2e Content Type
    c2eWriter.defineC2eContentType('EPUB', [
      {property: "id", type: INTEGER_TYPE},
      {property: "title", type: STRING_TYPE},
      {property: "description", type: STRING_TYPE},
      {property: "file", type: STRING_TYPE},
    ]);

    // Make C2e Content
    c2eWriter.createC2eContent('EPUB', {
      id: this.cee.id,
      title: this.cee.title,
      description: this.cee.description,
      file: this.c2eMediaFile
    });

    // Make C2e Metadata
    c2eWriter.createC2eMetadata({
      version: 'v1.0',
      general: {
        title: this.cee.title,
        description: this.cee.description || 'No description available',
        keywords: this.getKeywords(),
      },
      subjectOf: {
        name: this.c2eSubjectOfName,
      },
      author: {
        name: this.copyrightHolder.name,
        email: this.copyrightHolder.email,
        url: this.copyrightHolder.url
      },
      publisher: {
        name: this.pulisher.name,
        email: this.pulisher.email,
        url: this.pulisher.url
      },
      license: {
        file: 'license.txt',
        type: 'text/plain'
      },
      licensee: {
        name: this.licensee.name,
        email: this.licensee.email,
        url: this.licensee.url
      },
      licenseType: this.licenseType,
      licenseTerms: this.licenseTerms,
      licensePrice: this.licensePrice,
      licenseIdentifier: this.licenseIdentifier,
      licenseDateCreated: this.licenseDateCreated,
      licenseExpires: this.licenseExpires,
      copyrightHolder: {
        type: this.copyrightHolder.getType() || C2E_PERSON_TYPE,
        name: this.copyrightHolder.name,
        email: this.copyrightHolder.email,
        url: this.copyrightHolder.url
      },
      copyrightNote: 'This C2E has all rights to ' + this.copyrightHolder.name,
      copyrightYear: '2023',
      codeVersion: 'v1.0',
      codeStatus: 'Beta'
    });


    c2eWriter.createC2eBreadcrumb(this.getBreadcrumb());

    c2eWriter.setSkipC2ePackage(this.skipC2ePackage);
    let readStream = c2eWriter.createC2e(c2eStoragePath);
    if (readStream === false) {
      c2eWriter.getErrors().forEach((error: string) => {
        console.log(error);
      });
      return false;
    } else {
      this.setC2eManifest(c2eWriter.getC2e().toJsonLd());
      return readStream;
    }

  }
}
