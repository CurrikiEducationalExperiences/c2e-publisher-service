import {C2E_BreadcrumbList_TYPE, C2E_ListItem_TYPE} from '../constants';
import C2eBreadcrumbList from '../interfaces/C2eBreadcrumbList';
import C2eListItem from '../interfaces/C2eListItem';
import JsonLinkedData from './JsonLinkedData';

export default class C2eBreadcrumbListLd extends JsonLinkedData implements C2eBreadcrumbList {

  public breadcrumb: C2eListItem[] = [];

  constructor(
    public c2eId: string
  ) {
    const identifier = 'c2ens:c2eid-' + c2eId + '/BreadcrumbList';
    super(identifier, C2E_BreadcrumbList_TYPE);
  }

  addBreadcrumbItem(breadcrumbItem: C2eListItem): void {
    this.breadcrumb.push(breadcrumbItem);
  }

  getBreadcrumb(): C2eListItem[] {
    return this.breadcrumb;
  }

  toJsonLd(): Object {
    return {
      "@id": this.identifier,
      "@type": C2E_BreadcrumbList_TYPE,
      "itemListElement": this.breadcrumb.map((breadcrumbItem: C2eListItem) => {
        return {
          "@type": C2E_ListItem_TYPE,
          "position": breadcrumbItem.getPosition(),
          "item": {
            "@id": breadcrumbItem.getIdentifier(),
            "name": breadcrumbItem.getName()
          }
        };
      })
    };
  }
}
