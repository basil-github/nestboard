import * as fs from "fs";
import * as handlebars from "handlebars";
import { FelidType } from "./types";
const path = require("path");
export class ControlModule {
  static async create(crtArg: any): Promise<any> {
    const singularName = crtArg.contentType.singularName.toLowerCase();
    const pluralName = crtArg.contentType.pluralName.toLowerCase();
    const className = this.capitalize(singularName);
    let modals = crtArg.contentType.attributes;
    try {
      modals = await FelidType.restructure(modals);
      await this.createRootPath(pluralName);
      await this.createModalPath(pluralName);
      await this.createFile(
        path.join(__dirname, "templates", "main.hbs"),
        `src/api/${pluralName}/modals/main.ts`,
        { className, modals }
      );
      await this.createFile(
        path.join(__dirname, "templates", "create.hbs"),
        `src/api/${pluralName}/modals/create.ts`,
        { className }
      );
      await this.createFile(
        path.join(__dirname, "templates", "read.hbs"),
        `src/api/${pluralName}/modals/read.ts`,
        { className }
      );
      await this.createFile(
        path.join(__dirname, "templates", "update.hbs"),
        `src/api/${pluralName}/modals/update.ts`,
        { className }
      );
      await this.createFile(
        path.join(__dirname, "templates", "service.hbs"),
        `src/api/${pluralName}/${singularName}.service.ts`,
        { className, pluralName, singularName }
      );
      await this.createFile(
        path.join(__dirname, "templates", "controller.hbs"),
        `src/api/${pluralName}/${singularName}.controller.ts`,
        { className, pluralName, singularName }
      );
      await this.createFile(
        path.join(__dirname, "templates", "module.hbs"),
        `src/api/${pluralName}/${singularName}.module.ts`,
        { className, pluralName, singularName }
      );
      await this.importModule(className, pluralName, singularName);
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  static createApiRoot(): any {
    const dir = `src/api`;
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, (err) => {
        if (err) {
          console.error(err);
          return err;
        }
      });
    }
  }
  static createRootPath(pluralName: string): any {
    const dir = `src/api/${pluralName}`;
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, (err) => {
        if (err) {
          console.error(err);
          return err;
        }
      });
    }
  }
  static createModalPath(pluralName: string): any {
    const dir = `src/api/${pluralName}/modals`;
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, (err) => {
        if (err) {
          console.error("createModalPath", err);
          return err;
        }
      });
    }
  }
  static createFile(tempPath: string, destPath: string, data: any): any {
    try {
      const templateSource = fs.readFileSync(tempPath, "utf-8");
      const template = handlebars.compile(templateSource);
      const result = template(data);
      fs.writeFileSync(destPath, result);
    } catch (err) {
      console.log("createFile", err);
      return err;
    }
  }
  static capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1);
  static importModule(
    className: string,
    pluralName: string,
    singularName: string
  ) {
    const filePath = "src/app.module.ts";
    const newModule = `${className}Module`;
    const lineToPrepend = `import { ${newModule} } from './api/${pluralName}/${singularName}.module';\n`;
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return err;
      }
      const updatedData = lineToPrepend + data;
      if (!data.toString().includes(lineToPrepend)) {
        fs.writeFile(filePath, updatedData, (err) => {
          if (err) {
            return err;
          }
        });
      }
    });
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const regex =
      /(@Module\s*\({\s*imports\s*:\s*\[)(\s*(?:[^[\]]|\[(?:[^[\]]|\[[^[\]]*\])*\])*\s*)(\])/g;
    const newContent = fileContents.replace(regex, `$1$2${newModule},\n$3`);
    if (!fileContents.includes(`${className}Module,`)) {
      fs.writeFileSync(filePath, newContent);
    }
  }
  static rmvImportModule(
    className: string,
    pluralName: string,
    singularName: string
  ) {
    const filePath = "src/app.module.ts";
    const newModule = `${className}Module`;
    const lineToPrepend = `import { ${newModule} } from './api/${pluralName}/${singularName}.module';\n`;
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return err;
      }
      const updatedData = data.replace(lineToPrepend, "");
      if (data.toString().includes(lineToPrepend)) {
        fs.writeFile(filePath, updatedData, (err) => {
          if (err) {
            return err;
          }
        });
      }
    });
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const regex =
      /(@Module\s*\({\s*imports\s*:\s*\[)(\s*(?:[^[\]]|\[(?:[^[\]]|\[[^[\]]*\])*\])*\s*)(\])/g;
    const newContent = fileContents.replace(regex, `$1$2${newModule},\n$3`);
    if (!fileContents.includes(`${className}Module,`)) {
      fs.writeFileSync(filePath, newContent);
    }
  }
  static async deleteField(crtArg: any) {
    const singularName = crtArg.contentType.singularName.toLowerCase();
    const pluralName = crtArg.contentType.pluralName.toLowerCase();
    const className = this.capitalize(singularName);
    let modals = crtArg.contentType.attributes;
    modals = await FelidType.restructure(modals);
    try {
      await this.createFile(
        path.join(__dirname, "templates", "main.hbs"),
        `src/api/${pluralName}/modals/main.ts`,
        { className, modals }
      );
    } catch (error) {
      return error;
    }
  }

  static delete(api: string) {
    function deleteFolderRecursive(folderPath: string) {
      console.log(folderPath);
      if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
          const curPath = path.join(folderPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            deleteFolderRecursive(curPath);
          } else {
            try {
              fs.unlinkSync(curPath);
            } catch (err) {
              console.error(`Error deleting file ${curPath}: ${err}`);
            }
          }
        });
        try {
          fs.rmdirSync(folderPath);
        } catch (err) {
          console.error(`Error deleting directory ${folderPath}: ${err}`);
        }
      }
    }
    // this.rmvImportModule()
    deleteFolderRecursive(`src/api/${api}/modals`);
    deleteFolderRecursive(`src/api/${api}`);
  }
}
