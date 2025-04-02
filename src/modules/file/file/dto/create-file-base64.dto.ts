export class CreateFileEntityBase64Dto {
  entityOwnerId: number;
  typeEntity: string;
  files: { name: string; base64: string }[];
}
