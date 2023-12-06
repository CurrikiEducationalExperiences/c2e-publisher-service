import {ReadStream} from 'fs';
import {CeeListing, CeeMedia, CeeProductWcStore, CeeStore, CeeWriter as CeeWriterModel} from '../../models';
import {CeeListingRepository, CeeMediaCeeRepository, CeeMediaRepository, CeeRepository} from '../../repositories';
import {CeeWriter} from '../../services/cee-writer.service';
import C2eLicenseeLd from '../c2e-core/classes/C2eLicenseeLd';
import C2eMdCopyrightHolderLd from '../c2e-core/classes/C2eMdCopyrightHolderLd';
import C2ePublisherLd from '../c2e-core/classes/C2ePublisherLd';
import {C2E_ORGANIZATION_TYPE} from '../c2e-core/constants';
import {ceeListByMediaRequest} from '../openapi-schema';
import {protectCee} from './protect-cee';

export const listToStore = async (
  ceeStoreConfig: Object,
  ceeProductWcStore: CeeProductWcStore,
): Promise<Boolean> => {

  const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
  const api = new WooCommerceRestApi({...ceeStoreConfig});
  try {
    await api.post('products', {...ceeProductWcStore});
    return true;
  } catch (error) {
    console.log("Response Status:", error.response.status);
    console.log("Response Headers:", error.response.headers);
    console.log("Response Data:", error.response.data);
    return false;
  }
}

export const listCeeByMedia = async (
  ceeMediaRepository: CeeMediaRepository,
  ceeListRequest: typeof ceeListByMediaRequest,
  ceeWriterRecord: CeeWriterModel,
  ceeStoreRecord: CeeStore,
  ceeRepository: CeeRepository,
  ceeMediaCeeRepository: CeeMediaCeeRepository,
  ceeListingRepository: CeeListingRepository,
  ceeMediaRecord: CeeMedia
): Promise<CeeListing> => {

  const ceeMediaParentRecord = ceeMediaRecord?.parentId ? await ceeMediaRepository.findById(ceeMediaRecord.parentId) : null;
  const ceeMediaInHierarchy = await ceeMediaRepository.findOneInHierarchy(ceeMediaRecord.id);

  const rootparentid = ceeMediaInHierarchy && ceeMediaInHierarchy?.rootparentid ? ceeMediaInHierarchy?.rootparentid : '';
  const ceeRootMedia = await ceeMediaRepository.findById(rootparentid);
  const rootCollection = ceeRootMedia?.collection ? ceeRootMedia?.collection : 'C2Es';
  const bookCollection = ceeRootMedia?.title ? ceeRootMedia?.title : 'C2E Collection';
  const unitCollection = ceeMediaInHierarchy?.parentid && ceeMediaInHierarchy?.parentid === rootparentid ? 'Default Collection' :
    (ceeMediaParentRecord?.title ? ceeMediaParentRecord?.title : 'Default Collection');


  const ceeMasterRecord = await ceeRepository.create({title: ceeMediaRecord.title});
  const ceePreviewRecord = await ceeRepository.create({title: ceeMediaRecord.title});

  const ceePreviewLicensee = Object.assign(new C2eLicenseeLd(ceePreviewRecord.id), {name: 'Preview C2E', email: 'preview-c2e@curriki.org', url: 'c2e.curriki.org/preview'});
  const ceePreviewCopyrightHolder = Object.assign(
    new C2eMdCopyrightHolderLd(ceePreviewRecord.id, C2E_ORGANIZATION_TYPE),
    {name: ceeListRequest?.copyrightHolder?.name, email: ceeListRequest?.copyrightHolder?.email, url: ceeListRequest?.copyrightHolder?.url}
  );
  const ceePublisher = Object.assign(new C2ePublisherLd(ceePreviewRecord.id, C2E_ORGANIZATION_TYPE),
    {name: ceeWriterRecord.name, email: ceeWriterRecord.email, url: ceeWriterRecord.url}
  );

  const ceeMasterLicensee = Object.assign(new C2eLicenseeLd(ceeMasterRecord.id), {name: 'Master C2E', email: 'master-c2e@curriki.org', url: 'c2e.curriki.org/master'});
  const ceeMasterCopyrightHolder = Object.assign(
    new C2eMdCopyrightHolderLd(ceeMasterRecord.id, C2E_ORGANIZATION_TYPE),
    {name: ceeListRequest?.copyrightHolder?.name, email: ceeListRequest?.copyrightHolder?.email, url: ceeListRequest?.copyrightHolder?.url}
  );

  const title = (ceeListRequest?.title ? ceeListRequest.title : 'No Title');
  const description = (ceeListRequest?.description ? ceeListRequest.description : 'No Description');
  const identifierValue = (ceeListRequest?.identifier?.identifierValue ? ceeListRequest.identifier.identifierValue : '');
  const identifierType = (ceeListRequest?.identifier?.identifierType ? ceeListRequest.identifier.identifierType : '');
  const price = (ceeListRequest?.price ? ceeListRequest.price : 0);

  // making master cee
  const ceeMasterWriter = new CeeWriter(
    ceeMasterRecord,
    ceeMasterLicensee,
    ceeMasterCopyrightHolder,
    ceePublisher,
    ceeMediaRecord.resource,
    'epub',
    (ceeRootMedia?.title ? ceeRootMedia?.title : ceeMediaParentRecord?.title),
    identifierValue,
    identifierType,
    'draft'
  );

  // Breadcrumb will be created in same order as defined array below. For example:
  // "Computer Science > Java For Dummies > Unit 1: Introduction to Java" would be defined as:
  ceeMasterWriter.setBreadcrumb([rootCollection, bookCollection, unitCollection]);
  // Keywords are like tags which can be used for searching and filtering
  ceeMasterWriter.setKeywords(["Education", "Curriculum", "Curriki", "EPUB"]);

  ceeMasterWriter.setLicenseType(ceeListRequest?.licenseType);
  ceeMasterWriter.setLicenseTerms(ceeListRequest?.licenseTerms);
  ceeMasterWriter.setLicensePrice(ceeListRequest?.price);
  ceeMasterWriter.setLicenseIdentifier('c2e-lsc-master');
  ceeMasterWriter.setLicenseDateCreated(new Date().toISOString());
  ceeMasterWriter.setLicenseExpires(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString());
  ceeMasterWriter.write();
  await ceeRepository.updateById(ceeMasterRecord.id, {title, description, manifest: ceeMasterWriter.getC2eManifest(), type: 'master'});
  await ceeMediaCeeRepository.create({ceeId: ceeMasterRecord.id, ceeMediaId: ceeMediaRecord.id});

  // making preview cee
  const ceePreviewWriter = new CeeWriter(
    ceePreviewRecord,
    ceePreviewLicensee,
    ceePreviewCopyrightHolder,
    ceePublisher,
    ceeMediaRecord.resource,
    'epub',
    (ceeRootMedia?.title ? ceeRootMedia?.title : ceeMediaParentRecord?.title),
    identifierValue,
    identifierType,
    'preview'
  );

  // Breadcrumb will be created in same order as defined array below. For example:
  // "Computer Science > Java For Dummies > Unit 1: Introduction to Java" would be defined as:
  ceePreviewWriter.setBreadcrumb([rootCollection, bookCollection, unitCollection]);
  // Keywords are like tags which can be used for searching and filtering
  ceePreviewWriter.setKeywords(["Education", "Curriculum", "Curriki", "EPUB"]);

  ceePreviewWriter.setLicenseType(ceeListRequest?.licenseType);
  ceePreviewWriter.setLicenseTerms(ceeListRequest?.licenseTerms);
  ceePreviewWriter.setLicensePrice(ceeListRequest?.price);
  ceePreviewWriter.setLicenseIdentifier('c2e-lsc-preview');
  ceePreviewWriter.setLicenseDateCreated(new Date().toISOString());
  ceePreviewWriter.setLicenseExpires(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString());
  let ceePreviewFileStream: ReadStream | Boolean = ceePreviewWriter.write();
  await ceeRepository.updateById(ceePreviewRecord.id, {title, description, manifest: ceePreviewWriter.getC2eManifest(), type: 'preview'});
  await protectCee(ceePreviewFileStream, ceePreviewRecord);

  // making c2e listing
  const ceeListingRecord = await ceeListingRepository.create({ceePreviewId: ceePreviewRecord.id, ceeMasterId: ceeMasterRecord.id, ceeWriterId: ceeWriterRecord.id, ceeStoreId: ceeStoreRecord.id});
  return ceeListingRecord;
}
