"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashBoardModule = void 0;
const create_1 = require("../controls/create");
class DashBoardModule {
    static setup(path, app, document) {
        const httpAdapter = app.getHttpAdapter();
        httpAdapter.get(`${path}/ui-data-init.js`, (req, res) => {
            res.type("application/json");
            res.send(document);
        });
        httpAdapter.post(`${path}/create-collection`, (req, res) => {
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
        httpAdapter.delete(`${path}/delete-collection/:api`, (req, res) => {
            create_1.ControlModule.delete(req.params.api);
        });
        create_1.ControlModule.createApiRoot();
    }
}
exports.DashBoardModule = DashBoardModule;
//# sourceMappingURL=index.js.map