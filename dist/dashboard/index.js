"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashBoardModule = void 0;
const create_1 = require("../controls/create");
const types_1 = require("../controls/types");
const express = require("express");
const path = require("path");
var cors = require('cors');
class DashBoardModule {
    static setup(entryPath, app, document) {
        const httpAdapter = app.getHttpAdapter();
        httpAdapter.get(`/ui-data-init.json`, (req, res) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Content-Type", "application/json");
            const felidType = types_1.FelidType.allTypes();
            res.send(Object.assign(Object.assign({}, document), { felidType }));
        });
        httpAdapter.use(express.static(path.join(__dirname, 'build')));
        // httpAdapter.get(entryPath, (req: any, res: any) => {
        //   res.sendFile(path.join(__dirname, 'build', 'index.html'))
        // });
        httpAdapter.post(`${entryPath}/create-collection`, (req, res) => {
            let data = "";
            req.on("data", (chunk) => {
                data += chunk;
            });
            req.on("end", () => {
                create_1.ControlModule.create(JSON.parse(data));
                res.type("application/json");
                res.send(document);
            });
        });
        httpAdapter.delete(`${entryPath}/delete-collection/:api`, (req, res) => {
            create_1.ControlModule.delete(req.params.api);
        });
        create_1.ControlModule.createApiRoot();
    }
}
exports.DashBoardModule = DashBoardModule;
//# sourceMappingURL=index.js.map