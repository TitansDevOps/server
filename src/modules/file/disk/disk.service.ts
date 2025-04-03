import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disk } from '@modules/file/disk/entities/disk.entity';
import { messages } from 'src/messages/messages';

@Injectable()
export class DiskService {
  constructor(
    @InjectRepository(Disk)
    private diskRepository: Repository<Disk>,
  ) {}

  async diskCreate(filePath: string) {
    const disksToCreate = [];

    const publicExists = await this.diskRepository.findOne({
      where: { name: 'public' },
    });
    if (!publicExists) {
      disksToCreate.push(
        this.diskRepository.create({
          name: 'public',
          path: `${filePath}\\public`,
        }),
      );
    }

    const privateExists = await this.diskRepository.findOne({
      where: { name: 'private' },
    });
    if (!privateExists) {
      disksToCreate.push(
        this.diskRepository.create({
          name: 'private',
          path: `${filePath}\\private`,
        }),
      );
    }

    if (disksToCreate.length === 0) {
      throw new Error(messages.diskPreexistent);
    }

    const createdDisks = await Promise.all(
      disksToCreate.map((disk) => this.diskRepository.save(disk)),
    );

    return createdDisks;
  }
}
