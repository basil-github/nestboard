
# NestBoard

![Logo](https://github.com/basil-github/public/blob/main/nestboard/logo.png?raw=true)

NestBoard is a package that allows you to easily create CRUD APIs through a dashboard. With this package, you can quickly generate code for creating, reading, updating, and deleting records in your database. In addition to CRUD APIs, the package also provides dashboard features for managing and organizing all of your APIs.
 
NestBoard is built on top of Swagger documentation, which means that it uses the Swagger API specification to generate and manage your API code. This allows you to easily modify and customize your APIs through a web-based dashboard without needing to manually edit any code.


## Getting Started
To get started with using the NestBoard package, follow these steps:



1. Install the package using npm or yarn:

```bash
npm install --save nestboard
```
or
```bash
yarn add nestboard
```
2. import SwaggerModule and DashBoardModule :

```bash
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DashBoardModule } from 'nestboard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, SwaggerConfig);
 
  DashBoardModule.setup(app, document);

  await app.listen(3000);
}
bootstrap();
```
Need to setup DashBoardModule 
```bash
  DashBoardModule.setup(app, document);
```

3. Run project in watch mode (--watch) :
```bash
yarn start:dev
```
or
```bash
npm run start
```
you can access the NestBoard dashboard at
 ```bash
http://localhost:3000/nestboard/.
```