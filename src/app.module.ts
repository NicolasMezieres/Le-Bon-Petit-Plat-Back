import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CommentaryModule } from './commentary/commentary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriModule } from './favori/favori.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { RecipeModule } from './recipe/recipe.module';
import { CategoryModule } from './category/category.module';
import { ImageModule } from './image/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'uploads'),
      serveRoot: '/imageFile',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_MONGODB_URL, {
      dbName: 'LeBonPetitPlat',
    }),
    PrismaModule,
    CommentaryModule,
    FavoriModule,
    UserModule,
    AuthModule,
    EmailModule,
    RecipeModule,
    CategoryModule,
    ImageModule,
  ],
})
export class AppModule {}
