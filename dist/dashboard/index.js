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
exports.DashBoardModule = void 0;
const create_1 = require("../controls/create");
const types_1 = require("../controls/types");
const express = require("express");
const path = require("path");
var cors = require("cors");
class DashBoardModule {
    static setup(app, document) {
        const httpAdapter = app.getHttpAdapter();
        const entryPath = "/nestboard";
        httpAdapter.get(`${entryPath}/sse`, (req, res) => {
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            const dataInterval = setInterval(() => {
                res.write(`data: ${JSON.stringify(true)}\n\n`);
            }, 1000);
            req.on("close", () => {
                clearInterval(dataInterval);
            });
        });
        httpAdapter.get(`/ui-data-init.json`, (req, res) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Content-Type", "application/json");
            const felidType = types_1.FelidType.allTypes();
            res.send(Object.assign(Object.assign({}, document), { felidType }));
        });
        httpAdapter.use(entryPath, express.static(path.join(__dirname, "build")));
        httpAdapter.get(entryPath, (req, res) => {
            res.sendFile(path.join(__dirname, "build", "index.html"));
        });
        httpAdapter.post(`${entryPath}/create-collection`, (req, res) => {
            let data = "";
            req.on("data", (chunk) => {
                data += chunk;
            });
            req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield create_1.ControlModule.create(JSON.parse(data));
                    res.type("application/json");
                    res.send(document);
                }
                catch (error) {
                    res.type("application/json");
                    res.status(500);
                    res.send({
                        error: "Something went wrong",
                    });
                }
            }));
        });
        httpAdapter.delete(`${entryPath}/delete-field`, (req, res) => {
            let data = "";
            req.on("data", (chunk) => {
                data += chunk;
            });
            req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield create_1.ControlModule.deleteField(JSON.parse(data));
                    res.type("application/json");
                    res.send({
                        success: "success",
                    });
                }
                catch (error) {
                    res.type("application/json");
                    res.status(500);
                    res.send({
                        error: "Something went wrong",
                    });
                }
            }));
        });
        httpAdapter.delete(`${entryPath}/delete-collection/:api`, (req, res) => {
            create_1.ControlModule.delete(req.params.api);
        });
        create_1.ControlModule.createApiRoot();
    }
}
exports.DashBoardModule = DashBoardModule;
//# sourceMappingURL=index.js.map