import { Request, Response } from "express";
import { ControlModule } from "../controls/create";

export class DashBoardModule {
  static setup(path: string, app: any, document: any): void {
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get(
      `${path}/ui-data-init.js`,
      (req: Request, res: Response) => {
        res.type("application/json");
        res.send(document);
      }
    );
    httpAdapter.post(
      `${path}/create-collection`,
      (req: Request, res: Response) => {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => {
          ControlModule.create(JSON.parse(data));
          res.type("application/json");
          res.send(document);
        });
      }
    );
    httpAdapter.delete(
      `${path}/delete-collection/:api`,
      (req: Request, res: Response) => {
        ControlModule.delete(req.params.api)
      }
    );
    ControlModule.createApiRoot();
  }
}
