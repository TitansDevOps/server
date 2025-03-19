import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disk } from '@modules/file/disk/entities/disk.entity';

@Injectable()
export class DiskService {
  constructor(
    @InjectRepository(Disk)
    private diskRepository: Repository<Disk>,
  ) {}

  async diskCreate(filePath: string) {
    const publicDisk = this.diskRepository.create({
      name: 'public',
      path: filePath + '\\public',
    });

    const privateDisk = this.diskRepository.create({
      name: 'private',
      path: filePath + '\\private',
    });

    const disks = await Promise.all([
      this.diskRepository.save(publicDisk),
      this.diskRepository.save(privateDisk),
    ]);

    return disks;
  }
}
