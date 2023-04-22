import { Request, Response } from "express";
import { ControlModule } from "../controls/create";
import { FelidType } from "../controls/types";
const express = require("express");
const path = require("path");
var cors = require('cors');

export class DashBoardModule {
  static setup(entryPath: string, app: any, document: any): void {
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get(`/ui-data-init.json`,
      (req: Request, res: Response) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        const felidType = FelidType.allTypes()
        res.send({ ...document, felidType });
      }
    );
    httpAdapter.use(express.static(path.join(__dirname, 'build')));
    // httpAdapter.get(entryPath, (req: any, res: any) => {
    //   res.sendFile(path.join(__dirname, 'build', 'index.html'))

    // });
    httpAdapter.post(
      `${entryPath}/create-collection`,
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
      `${entryPath}/delete-collection/:api`,
      (req: Request, res: Response) => {
        ControlModule.delete(req.params.api)
      }
    );
    ControlModule.createApiRoot();
  }
}
