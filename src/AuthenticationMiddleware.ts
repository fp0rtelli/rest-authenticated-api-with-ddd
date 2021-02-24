import { Request, Response } from "express";
import httpStatusCodes from "http-status-codes";
import base64 from "base-64";
import { IAuthenticationService } from "./domain/AuthenticationService";

export default class AuthenticationMiddleware {
  constructor(private readonly authenticationService: IAuthenticationService) {};

  async check(req: Request, res: Response, next: Function): Promise<void> {
    const authorizationHeader = req.header("Authorization");
    if (!authorizationHeader) return res.sendStatus(httpStatusCodes.UNAUTHORIZED);

    const token = this.getToken(authorizationHeader);
    if (!token) return res.sendStatus(httpStatusCodes.UNAUTHORIZED);

    const user = this.decodeToken(token);
    try {
      await this.authenticationService.checkUser(user);
      next();
    } catch (err) {
      console.log(`Error while trying to authenticate user ${user.email}`);
      return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
    }
  }

  private getToken(authorization: string) {
    const token = authorization.split("Bearer ")[1];
    if (!token) throw new Error("Malformed authorization header");

    return token
  }

  private decodeToken(token: string) {
    const uncryptedToken = base64.decode(token).split(decodeKey); // Some mechanism to extract informations from token, here let's assume that it consists in decoding token from base64 to string
                                                                  // Let's assume the output of this give tuple email/password separated by a constant (cf decodeKey)
    if (uncryptedToken.length !== 2) throw new Error("Malformed token");

    const email = uncryptedToken[0];
    const password = uncryptedToken[1];
    if (!email || !password) throw new Error("Missing token information");
  
    return { email, password };
  }
}

const decodeKey = "OGQ5MjMwMTktYzg0MC00NDg3LTgzOTMtMGE0MDlmYzEwMWFk"
