import C2eListItem from './C2eListItem';
import JsonLd from './JsonLd';

export default interface c2eBreadcrumbList extends JsonLd {
  breadcrumb: C2eListItem[];
  addBreadcrumbItem(breadcrumb: C2eListItem): void;
  getBreadcrumb(): C2eListItem[];
}
