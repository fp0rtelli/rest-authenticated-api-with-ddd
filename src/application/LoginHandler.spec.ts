import * as httpMocks from "node-mocks-http";
import httpStatusCode from "http-status-codes";
import { ROUTES } from "../Routes";
import LoginHandler from "./LoginHandler";

describe("LoginHandler", () => {
  const authenticationService = {
    checkUser: jest.fn(),
    addUser: jest.fn(),
    getPassword: jest.fn()
  };
  const nextMock = jest.fn();
  const loginHandler = new LoginHandler(authenticationService);

  afterEach(() => {
    jest.resetAllMocks();
  })

  describe("getAccess", () => {
    const url = ROUTES.LOGIN;
    const method = "POST";

    it("should return 200 if user is checked successfully", async () => {
      expect.assertions(3);
  
      authenticationService.checkUser.mockResolvedValueOnce({});
      const body = { email: "fakeEmail", password: "fakePassword" }
      const req = httpMocks.createRequest({
        body,
        url,
        method,
      });
      const res = httpMocks.createResponse({});

      await loginHandler.getAccess(req, res, nextMock);

      expect(authenticationService.checkUser).toHaveBeenCalledTimes(1);
      expect(authenticationService.checkUser).toHaveBeenNthCalledWith(1, { email: body.email, password: body.password });
      expect(res.statusCode).toEqual(httpStatusCode.OK);
    });

    it("should return 400 if malformed request", async () => {
      expect.assertions(2);
  
      const body = { unknownKey: "fakeUnknownKey", password: "fakePassword" };
      const req = httpMocks.createRequest({
        body,
        url,
        method,
      });
      const res = httpMocks.createResponse({});

      await loginHandler.getAccess(req, res, nextMock);

      expect(authenticationService.checkUser).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(httpStatusCode.BAD_REQUEST);
    });

    it("should return 401 if user not checked successfully", async () => {
      expect.assertions(3);
  
      authenticationService.checkUser.mockRejectedValueOnce(new Error("fakeError"));
      const body = { email: "fakeEmail", password: "fakePassword" }
      const req = httpMocks.createRequest({
        body,
        url,
        method,
      });
      const res = httpMocks.createResponse({});

      await loginHandler.getAccess(req, res, nextMock);

      expect(authenticationService.checkUser).toHaveBeenCalledTimes(1);
      expect(authenticationService.checkUser).toHaveBeenNthCalledWith(1, { email: body.email, password: body.password });
      expect(res.statusCode).toEqual(httpStatusCode.UNAUTHORIZED);
    });
  });

  describe("register", () => {
    const url = ROUTES.REGISTER;
    const method = "POST";

    it("should return 201 if user registered successfully", async () => {
      expect.assertions(3);
  
      authenticationService.addUser.mockResolvedValueOnce({});
      const body = { email: "fakeEmail", password: "fakePassword" };
      const req = httpMocks.createRequest({
        body,
        url,
        method,
      });
      const res = httpMocks.createResponse({});

      await loginHandler.register(req, res, nextMock);

      expect(authenticationService.addUser).toHaveBeenCalledTimes(1);
      expect(authenticationService.addUser).toHaveBeenNthCalledWith(1, { email: body.email, password: body.password });
      expect(res.statusCode).toEqual(httpStatusCode.CREATED);
    });

    it("should return 400 if malformed request", async () => {
      expect.assertions(2);
  
      const body = { unknownKey: "fakeUnknownKey", password: "fakePassword" };
      const req = httpMocks.createRequest({
        body,
        url,
        method,
      });
      const res = httpMocks.createResponse({});

      await loginHandler.register(req, res, nextMock);

      expect(authenticationService.addUser).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(httpStatusCode.BAD_REQUEST);
    });

    it("should return 401 if another user with same infos is registered", async () => {
      expect.assertions(3);
  
      authenticationService.addUser.mockRejectedValueOnce(new Error("fakeError"));
      const body = { email: "fakeEmail", password: "fakePassword" }
      const req = httpMocks.createRequest({
        body,
        url,
        method,
      });
      const res = httpMocks.createResponse({});

      await loginHandler.register(req, res, nextMock);

      expect(authenticationService.addUser).toHaveBeenCalledTimes(1);
      expect(authenticationService.addUser).toHaveBeenNthCalledWith(1, { email: body.email, password: body.password });
      expect(res.statusCode).toEqual(httpStatusCode.UNAUTHORIZED);
    });
  });

  describe("forgetPassword", () => {
    const url = ROUTES.FORGET_PASSWORD;
    const method = "POST";

    it("should return 200 if user password retrieved successfully", async () => {
      expect.assertions(3);
  
      authenticationService.getPassword.mockResolvedValueOnce({});
      const body = { email: "fakeEmail" };
      const req = httpMocks.createRequest({
        body,
        url,
        method,
      });
      const res = httpMocks.createResponse({});

      await loginHandler.forgetPassword(req, res, nextMock);

      expect(authenticationService.getPassword).toHaveBeenCalledTimes(1);
      expect(authenticationService.getPassword).toHaveBeenNthCalledWith(1, body.email);
      expect(res.statusCode).toEqual(httpStatusCode.OK);
    });

    it("should return 400 if malformed request", async () => {
      expect.assertions(2);
  
      const body = { unknownKey: "fakeUser" };
      const req = httpMocks.createRequest({
        body,
        url,
        method,
      });
      const res = httpMocks.createResponse({});

      await loginHandler.forgetPassword(req, res, nextMock);

      expect(authenticationService.getPassword).toHaveBeenCalledTimes(0);
      expect(res.statusCode).toEqual(httpStatusCode.BAD_REQUEST);
    });

    it("should return 404 if unable to find user", async () => {
      expect.assertions(3);
  
      authenticationService.getPassword.mockRejectedValueOnce(new Error("fakeError"));
      const body = { email: "fakeUser" };
      const req = httpMocks.createRequest({
        body,
        url,
        method,
      });
      const res = httpMocks.createResponse({});

      await loginHandler.forgetPassword(req, res, nextMock);

      expect(authenticationService.getPassword).toHaveBeenCalledTimes(1);
      expect(authenticationService.getPassword).toHaveBeenNthCalledWith(1, body.email);
      expect(res.statusCode).toEqual(httpStatusCode.NOT_FOUND);
    });
  });
});