import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UploadToAwsProvider } from './providers/upload-to-aws.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './upload.entity';
import { ConfigService } from '@nestjs/config';
import { FileTypes } from './enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    private readonly configService: ConfigService,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    const supportedMimeTypes = [
      'image/gif',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    if (!supportedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('MIME type not supported');
    }

    try {
      const name = await this.uploadToAwsProvider.uploadFile(file);

      const uploadFile: Partial<Upload> = {
        name: name,
        path: `https://${this.configService.get('appConfig.awsCloudfrontUrl')}/${name}`,
        type: FileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
