"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlModule = void 0;
const fs = require("fs");
const handlebars = require("handlebars");
const types_1 = require("./types");
const path = require("path");
class ControlModule {
    static create(crtArg) {
        return __awaiter(this, void 0, void 0, function* () {
            const singularName = crtArg.contentType.singularName.toLowerCase();
            const pluralName = crtArg.contentType.pluralName.toLowerCase();
            const className = this.capitalize(singularName);
            let modals = crtArg.contentType.attributes;
            try {
                modals = yield types_1.FelidType.restructure(modals);
                yield this.createRootPath(pluralName);
                yield this.createModalPath(pluralName);
                yield this.createFile(path.join(__dirname, "templates", "main.hbs"), `src/api/${pluralName}/modals/main.ts`, { className, modals });
                yield this.createFile(path.join(__dirname, "templates", "create.hbs"), `src/api/${pluralName}/modals/create.ts`, { className });
                yield this.createFile(path.join(__dirname, "templates", "read.hbs"), `src/api/${pluralName}/modals/read.ts`, { className });
                yield this.createFile(path.join(__dirname, "templates", "update.hbs"), `src/api/${pluralName}/modals/update.ts`, { className });
                yield this.createFile(path.join(__dirname, "templates", "service.hbs"), `src/api/${pluralName}/${singularName}.service.ts`, { className, pluralName, singularName });
                yield this.createFile(path.join(__dirname, "templates", "controller.hbs"), `src/api/${pluralName}/${singularName}.controller.ts`, { className, pluralName, singularName });
                yield this.createFile(path.join(__dirname, "templates", "module.hbs"), `src/api/${pluralName}/${singularName}.module.ts`, { className, pluralName, singularName });
                yield this.importModule(className, pluralName, singularName);
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    static createApiRoot() {
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
    static createRootPath(pluralName) {
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
    static createModalPath(pluralName) {
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
    static createFile(tempPath, destPath, data) {
        try {
            const templateSource = fs.readFileSync(tempPath, "utf-8");
            const template = handlebars.compile(templateSource);
            const result = template(data);
            fs.writeFileSync(destPath, result);
        }
        catch (err) {
            console.log("createFile", err);
            return err;
        }
    }
    static importModule(className, pluralName, singularName) {
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
        const regex = /(@Module\s*\({\s*imports\s*:\s*\[)(\s*(?:[^[\]]|\[(?:[^[\]]|\[[^[\]]*\])*\])*\s*)(\])/g;
        const newContent = fileContents.replace(regex, `$1$2${newModule},\n$3`);
        if (!fileContents.includes(`${className}Module,`)) {
            fs.writeFileSync(filePath, newContent);
        }
    }
    static rmvImportModule(className, pluralName, singularName) {
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
        const regex = /(@Module\s*\({\s*imports\s*:\s*\[)(\s*(?:[^[\]]|\[(?:[^[\]]|\[[^[\]]*\])*\])*\s*)(\])/g;
        const newContent = fileContents.replace(regex, `$1$2${newModule},\n$3`);
        if (!fileContents.includes(`${className}Module,`)) {
            fs.writeFileSync(filePath, newContent);
        }
    }
    static deleteField(crtArg) {
        return __awaiter(this, void 0, void 0, function* () {
            const singularName = crtArg.contentType.singularName.toLowerCase();
            const pluralName = crtArg.contentType.pluralName.toLowerCase();
            const className = this.capitalize(singularName);
            let modals = crtArg.contentType.attributes;
            modals = yield types_1.FelidType.restructure(modals);
            try {
                yield this.createFile(path.join(__dirname, "templates", "main.hbs"), `src/api/${pluralName}/modals/main.ts`, { className, modals });
            }
            catch (error) {
                return error;
            }
        });
    }
    static delete(api) {
        function deleteFolderRecursive(folderPath) {
            console.log(folderPath);
            if (fs.existsSync(folderPath)) {
                fs.readdirSync(folderPath).forEach((file) => {
                    const curPath = path.join(folderPath, file);
                    if (fs.lstatSync(curPath).isDirectory()) {
                        deleteFolderRecursive(curPath);
                    }
                    else {
                        try {
                            fs.unlinkSync(curPath);
                        }
                        catch (err) {
                            console.error(`Error deleting file ${curPath}: ${err}`);
                        }
                    }
                });
                try {
                    fs.rmdirSync(folderPath);
                }
                catch (err) {
                    console.error(`Error deleting directory ${folderPath}: ${err}`);
                }
            }
        }
        // this.rmvImportModule()
        deleteFolderRecursive(`src/api/${api}/modals`);
        deleteFolderRecursive(`src/api/${api}`);
    }
}
ControlModule.capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);
exports.ControlModule = ControlModule;
//# sourceMappingURL=create.js.map