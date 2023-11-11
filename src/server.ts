import "reflect-metadata";
import { useExpressServer, useContainer, Action, UnauthorizedError } from "routing-controllers";
import express, { Application, Request, Response } from "express";
import Container, { Service } from "typedi";
import morgan from "morgan";
import CORS from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import UsersController from "./collection/users/users.controller";
import { PinoLogger } from "./utils/logger"
import jwt from 'jsonwebtoken'

@Service()
export default class ExpressServer {
  readonly server: Application;
  readonly port: number;
  readonly logger: PinoLogger

  constructor(
    port = 4000,
    logger: PinoLogger
  ) {
    this.port = port;
    this.server = this._expressServer();
    this.logger = logger
  }

  public run(): void {
    this.server.listen(this.port, () => {});
    this.logger.info(`Server started on PORT: ${this.port}`)
  }

  controllers() {
    return [
      UsersController
    ];
  }

  private _expressServer(): Application {
    const app = express();

    app.use(CORS());
    app.use(cookieParser());
    app.use(express.json());
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(morgan('dev'));
    app.get("/", (_req: Request, res: Response) => {
      res.send("OK");
    });
    app.disable("x-powered-by");

    useContainer(Container);

    return useExpressServer(app, {
      routePrefix: "/api",
      controllers: this.controllers(),
      authorizationChecker: async (action: Action) => {
        const _token = action.request.headers['authorization']

        if (!_token) throw new UnauthorizedError('Unauthorized')

        await jwt.verify(
            _token,
            (process.env.JWT_TOKEN ?? 'JWT_TOKEN'),
            (error: any, decoded: any) => {
                if (error) throw new UnauthorizedError('Unauthorized')
                console.log(decoded)
            }
        )

        return true
      }
    });
  }
}
