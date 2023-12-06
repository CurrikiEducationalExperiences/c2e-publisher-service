import {C2E_ListItem_TYPE} from '../constants';
import C2eListItem from '../interfaces/C2eListItem';
import JsonLinkedData from './JsonLinkedData';

export default class C2eListItemLd extends JsonLinkedData implements C2eListItem {

  constructor(
    public c2eId: string,
    public position: number = 0,
    public name: string = '',
  ) {
    const identifier = 'c2ens:c2eid-' + c2eId + '/ListItem/' + name.split(' ').join('-');
    super(identifier, C2E_ListItem_TYPE);
  }

  // set and get position
  setPosition(position: number): void {
    this.position = position;
  }

  getPosition(): number {
    return this.position;
  }

  // set and get name
  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  toJsonLd(): Object {
    return {
      "@type": C2E_ListItem_TYPE,
      "position": this.position,
      "item": {
        "@id": this.identifier,
        "name": this.name
      }
    };
  }

}
