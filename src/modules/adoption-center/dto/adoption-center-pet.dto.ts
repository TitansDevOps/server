import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { AdoptionCenter } from '@modules/adoption-center/entities/adoption-center.entity';
import { messages } from 'src/messages/messages';

export class AdoptionCenterPetDto {
  @IsNotEmpty({ message: messages.propertyIDRequired })
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsOptional()
  @IsString()
  website?: string | null;

  @IsOptional()
  @IsString()
  facebook?: string | null;

  @IsOptional()
  @IsString()
  instagram?: string | null;

  @IsOptional()
  @IsString()
  twitter?: string | null;

  @IsOptional()
  @IsString()
  youtube?: string | null;

  @IsOptional()
  @IsString()
  whatsapp?: string | null;

  active: boolean;

  files: any[] | [];

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      address: this.address ?? null,
      phone: this.phone ?? null,
      email: this.email ?? null,
      website: this.website ?? null,
      facebook: this.facebook ?? null,
      instagram: this.instagram ?? null,
      twitter: this.twitter ?? null,
      youtube: this.youtube ?? null,
      whatsapp: this.whatsapp ?? null,
      files: Array.isArray(this.files)
        ? this.files.filter((file) => file != null)
        : [],
    };
  }

  public fromModel(model: AdoptionCenter): AdoptionCenterPetDto {
    this.id = model.id;
    this.name = model.name;
    this.description = model.description;
    this.address = model.address ?? null;
    this.phone = model.phone ?? null;
    this.email = model.email ?? null;
    this.website = model.website ?? null;
    this.facebook = model.facebook ?? null;
    this.instagram = model.instagram ?? null;
    this.twitter = model.twitter ?? null;
    this.youtube = model.youtube ?? null;
    this.whatsapp = model.whatsapp ?? null;
    return this;
  }
}
