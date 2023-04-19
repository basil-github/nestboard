"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlModule = void 0;
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
class ControlModule {
    static create(crtArg) {
        const singularName = crtArg.contentType.singularName.toLowerCase();
        const pluralName = crtArg.contentType.pluralName.toLowerCase();
        const className = this.capitalize(singularName);
        try {
            this.createRootPath(pluralName);
            this.createModalPath(pluralName);
            this.createFile(path.join(__dirname, "templates", "main.hbs"), `src/api/${pluralName}/modals/main.ts`, { className });
            this.createFile(path.join(__dirname, "templates", "create.hbs"), `src/api/${pluralName}/modals/create.ts`, { className });
            this.createFile(path.join(__dirname, "templates", "read.hbs"), `src/api/${pluralName}/modals/read.ts`, { className });
            this.createFile(path.join(__dirname, "templates", "update.hbs"), `src/api/${pluralName}/modals/update.ts`, { className });
            this.createFile(path.join(__dirname, "templates", "service.hbs"), `src/api/${pluralName}/${singularName}.service.ts`, { className, pluralName, singularName });
            this.createFile(path.join(__dirname, "templates", "controller.hbs"), `src/api/${pluralName}/${singularName}.controller.ts`, { className, pluralName, singularName });
            this.createFile(path.join(__dirname, "templates", "module.hbs"), `src/api/${pluralName}/${singularName}.module.ts`, { className, pluralName, singularName });
            this.importModule(className, pluralName, singularName);
        }
        catch (err) {
            return err;
        }
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
                    console.error(err);
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
}
ControlModule.capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);
exports.ControlModule = ControlModule;
//# sourceMappingURL=create.js.map