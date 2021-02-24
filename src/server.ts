import * as express from "express";
import AuthenticationMiddleware from "./AuthenticationMiddleware";
import { AuthenticationRepository, AuthenticationService, IAuthenticationService } from "./domain/AuthenticationService";
import LoginHandler from "./application/LoginHandler";
import ResourceHandler from "./application/ResourceHandler";
import { ROUTES } from "./Routes";

class Server {
  private app: express.Application;
  private authentication: AuthenticationMiddleware;

  private authenticationService: IAuthenticationService;
  private authenticationRepository: AuthenticationRepository;
  private loginHandler: LoginHandler;
  private resourceHandler: ResourceHandler;

  constructor() {
    this.app = express();
    this.authenticationService = new AuthenticationService(this.authenticationRepository)
    this.authentication = new AuthenticationMiddleware(this.authenticationService)
    this.loginHandler = new LoginHandler(this.authenticationService);
    this.resourceHandler = new ResourceHandler();
  }

  run() {
    this.app.post(ROUTES.LOGIN, this.loginHandler.getAccess);
    this.app.post(ROUTES.REGISTER, this.loginHandler.register);
    this.app.post(ROUTES.FORGET_PASSWORD, this.loginHandler.forgetPassword);

    this.app.use(this.authentication.check);

    this.app.get(ROUTES.RESOURCE, this.resourceHandler.get)
  }
}

const server = new Server();
server.run();
