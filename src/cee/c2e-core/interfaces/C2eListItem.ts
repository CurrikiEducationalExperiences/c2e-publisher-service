import JsonLd from './JsonLd';

export default interface C2eListItem extends JsonLd {
  position: number;
  name: string;

  setPosition(position: number): void;
  getPosition(): number;
  setName(name: string): void;
  getName(): string;
}
