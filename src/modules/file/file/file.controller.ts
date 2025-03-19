import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '@modules/file/file/file.service';
import { CreateFileEntityDto } from '@modules/file/file/dto/create-file.dto';
import { DeleteFileDto } from '@modules/file/file/dto/delete-file.dto';
import { GetFilesByEntityDto } from '@modules/file/file/dto/get-files-entity.dto';
import { messages } from 'src/messages/messages';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { BaseController } from '@modules/admin/admin.controller';

@Controller('file')
@UseGuards(AuthGuard, RolesGuard)
export class FileController extends BaseController {
  constructor(private readonly fileService: FileService) {
    super();
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createFileEntityDto: CreateFileEntityDto,
    @Res() res: Response,
  ) {
    try {
      const response = await this.fileService.saveFiles(
        files,
        createFileEntityDto,
      );
      this.createdResponse(res, messages.successFileUpload, response);
    } catch (error) {
      this.badRequestResponse(res, messages.error, error);
    }
  }

  @Post('delete')
  async deleteFile(@Body() deleteFileDto: DeleteFileDto, @Res() res: Response) {
    try {
      const response = await this.fileService.deleteFile(deleteFileDto);
      this.successResponse(res, messages.successFileDelete, response);
    } catch (error) {
      this.badRequestResponse(res, messages.error, error);
    }
  }

  @Post('get')
  async getFilesByEntity(
    @Res() res: Response,
    @Body() getFilesByEntityDto: GetFilesByEntityDto,
  ) {
    try {
      const response =
        await this.fileService.getFilesByEntity(getFilesByEntityDto);
      this.successResponse(res, messages.success, response);
    } catch (error) {
      this.badRequestResponse(res, messages.error, error);
    }
  }
}
