import { Request, Response } from "express";
import { ControlModule } from "../controls/create";
import { FelidType } from "../controls/types";
const express = require("express");
const path = require("path");
export class DashBoardModule {
  static setup(app: any, document: any): void {
    const httpAdapter = app.getHttpAdapter();
    const entryPath = "/nestboard";
    httpAdapter.get(`${entryPath}/sse`, (req: Request, res: Response) => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      const dataInterval = setInterval(() => {
        res.write(`data: ${JSON.stringify(true)}`);
      }, 1000);
      req.on("close", () => {
        clearInterval(dataInterval);
      });
    });
    httpAdapter.get(`/ui-data-init.json`, (req: Request, res: Response) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Type", "application/json");
      const felidType = FelidType.allTypes();
      res.send({ ...document, felidType });
    });

    httpAdapter.use(entryPath, express.static(path.join(__dirname, "build")));
    httpAdapter.get(entryPath, (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "build", "index.html"));
    });
    httpAdapter.post(
      `${entryPath}/create-collection`,
      (req: Request, res: Response) => {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", async () => {
          try {
            await ControlModule.create(JSON.parse(data));
            res.type("application/json");
            res.send(document);
          } catch (error) {
            res.type("application/json");
            res.status(500);
            res.send({
              error: "Something went wrong",
            });
          }
        });
      }
    );
    httpAdapter.delete(
      `${entryPath}/delete-field`,
      (req: Request, res: Response) => {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", async () => {
          try {
            await ControlModule.deleteField(JSON.parse(data));
            res.type("application/json");
            res.send({
              success: "success",
            });
          } catch (error) {
            res.type("application/json");
            res.status(500);
            res.send({
              error: "Something went wrong",
            });
          }
        });
      }
    );
    httpAdapter.delete(
      `${entryPath}/delete-collection/:api`,
      (req: Request, res: Response) => {
        ControlModule.delete(req.params.api);
      }
    );
    ControlModule.createApiRoot();
  }
}
