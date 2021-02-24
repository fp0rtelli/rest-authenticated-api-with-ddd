import { Request, Response } from "express";
import { IAuthenticationService } from "../domain/AuthenticationService";
import httpStatusCodes from "http-status-codes";

export default class LoginHandler {
  constructor(private readonly authenticationService: IAuthenticationService) {};

  async getAccess(req: Request, res: Response, _next: Function) {
    const { email, password } = req.body;
    if (!email || !password) return res.sendStatus(httpStatusCodes.BAD_REQUEST)

    try {
      await this.authenticationService.checkUser({ email, password });
      return res.sendStatus(httpStatusCodes.OK);
    } catch (err) {
      console.log(`Unable to login user with email ${email}: ${err.message}`);
      return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
    }
  }

  async register(req: Request, res: Response, _next: Function) {
    const { email, password } = req.body;
    if (!email || !password) return res.sendStatus(httpStatusCodes.BAD_REQUEST);

    try {
      await this.authenticationService.addUser({ email, password });
      return res.sendStatus(httpStatusCodes.CREATED);
    } catch (err) {
      console.log(`Unable to create user with email ${email}: ${err.message}`);
      return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
    }
  }

  async forgetPassword(req: Request, res: Response, next: Function) {
    const { email } = req.body;
    if (!email) return res.sendStatus(httpStatusCodes.BAD_REQUEST);

    try {
      const password = await this.authenticationService.getPassword(email);
      return res.send({ email, password });
    } catch (err) {
      console.log(`Unable to retrieve password for user with email ${email}: ${err.message}`);
      return res.sendStatus(httpStatusCodes.NOT_FOUND);
    }
  }
}
