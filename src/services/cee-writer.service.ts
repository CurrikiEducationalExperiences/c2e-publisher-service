import {BindingScope, inject, injectable} from '@loopback/core';
import {ReadStream} from 'fs';
import C2ePersona from "../cee/c2e-core/interfaces/C2ePersona";
import {CeeWriterEpub} from '../cee/cee-writer/cee-writer-epub';
import {STORAGE_DIR} from '../keys';
import {Cee} from "../models/cee.model";

@injectable({
  scope: BindingScope.TRANSIENT,
  tags: {namespace: 'services', name: 'cee-writer'}
})

export class CeeWriterService {
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
    @inject(STORAGE_DIR) private storageDirectory: string,
    private cee: Cee,
    private licensee: C2ePersona,
    private copyrightHolder: C2ePersona,
    private publisher: C2ePersona,
    private c2eMediaFile: string = '',
    private c2eMediaMimetype: string = '',
    private c2eSubjectOfName: string = '',
    private c2eMediaIdentifier: string = '',
    private c2eMediaIdentifierType: string = '',
    private c2eStatus: string = 'published'
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

  setLicenseTerms(licenseTerms: string): void {
    this.licenseTerms = licenseTerms;
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
    if (this.getType('epub')) {
      const ceeEpubWriter = new CeeWriterEpub(
        this.storageDirectory,
        this.c2eMediaFile,
        this.c2eMediaMimetype,
        this.cee,
        this.licensee,
        this.copyrightHolder,
        this.publisher,
        this.c2eSubjectOfName,
        this.c2eMediaIdentifier,
        this.c2eMediaIdentifierType,
        this.c2eStatus
      );

      ceeEpubWriter.setSkipC2ePackage(this.skipC2ePackage);
      ceeEpubWriter.setBreadcrumb(this.breadcrumb);
      ceeEpubWriter.setKeywords(this.keywords);
      ceeEpubWriter.setLicenseType(this.licenseType);
      ceeEpubWriter.setLicenseTerms(this.licenseTerms);
      ceeEpubWriter.setLicensePrice(this.licensePrice);
      ceeEpubWriter.setLicenseIdentifier(this.licenseIdentifier);
      ceeEpubWriter.setLicenseDateCreated(this.licenseDateCreated);
      ceeEpubWriter.setLicenseExpires(this.licenseExpires);

      let fileReadStream = ceeEpubWriter.write();
      this.setC2eManifest(ceeEpubWriter.getC2eManifest());
      return fileReadStream;
    } else {
      return false;
    }
  }

  getType(type: string): boolean {
    return (this.c2eMediaMimetype?.indexOf(type) != undefined && this.c2eMediaMimetype?.indexOf('epub') > -1 ? true : false)
  }
}
