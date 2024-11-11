import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() image: Express.Multer.File) {
    if (!image) {
      throw new ForbiddenException('Image manquante');
    }
    return image.filename;
  }

  @Get('/view/:filename')
  viewImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', '..', 'uploads', filename);
    if (existsSync(filePath)) {
      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  }
}
