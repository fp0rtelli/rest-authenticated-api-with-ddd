import { AuthenticationService } from "./AuthenticationService";
import * as uuid from "uuid";

describe("AuthenticationService", () => {
  const authenticationRepository = {
    get: jest.fn(),
    create: jest.fn(),
    find: jest.fn()
  };
  const authenticationService = new AuthenticationService(authenticationRepository);

  afterEach(()=> {
    jest.resetAllMocks();
  });

  describe("checkUser", () => {
    it("should return a resolved promise if user successfully checked", async () => {
      expect.assertions(2);

      authenticationRepository.get.mockResolvedValueOnce({});
      const user = { email: "fakeEmail", password: "fakePassword" };

      await authenticationService.checkUser(user);

      expect(authenticationRepository.get).toHaveBeenCalledTimes(1);
      expect(authenticationRepository.get).toHaveBeenNthCalledWith(1, user);
    });

    it("should throw an error if user not found", async () => {
      expect.assertions(4);

      authenticationRepository.get.mockResolvedValueOnce(null);
      const user = { email: "fakeEmail", password: "fakePassword" };

      try {
        await authenticationService.checkUser(user);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual("Unable to authenticate user fakeEmail");
        expect(authenticationRepository.get).toHaveBeenCalledTimes(1);
        expect(authenticationRepository.get).toHaveBeenNthCalledWith(1, user);
      }
    });

    it("should return a rejected promise if user check failed", async () => {
      expect.assertions(4);

      authenticationRepository.get.mockRejectedValueOnce(new Error("fakeError"));
      const user = { email: "fakeEmail", password: "fakePassword" };

      try {
        await authenticationService.checkUser(user);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual("fakeError");
        expect(authenticationRepository.get).toHaveBeenCalledTimes(1);
        expect(authenticationRepository.get).toHaveBeenNthCalledWith(1, user);
      }
    });
  });

  describe("addUser", () => {
    it("should return a resolved promise if user successfully created", async () => {
      expect.assertions(2);

      authenticationRepository.create.mockResolvedValueOnce({});
      const user = { email: "fakeEmail", password: "fakePassword" };

      await authenticationService.addUser(user);

      expect(authenticationRepository.create).toHaveBeenCalledTimes(1);
      expect(authenticationRepository.create).toHaveBeenNthCalledWith(1, expect.objectContaining({ email: user.email, password: user.password }));
    });

    it("should return a rejected promise if user creation failed", async () => {
      expect.assertions(4);

      authenticationRepository.create.mockRejectedValueOnce(new Error("fakeError"));
      const user = { email: "fakeEmail", password: "fakePassword" };

      try {
        await authenticationService.addUser(user);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual("fakeError");
        expect(authenticationRepository.create).toHaveBeenCalledTimes(1);
        expect(authenticationRepository.create).toHaveBeenNthCalledWith(1, expect.objectContaining({ email: user.email, password: user.password }));
      }
    });
  });

  describe("forgotPassword", () => {
    
    it("should return a resolved promise if password retrieved successfully", async () => {
      expect.assertions(3);
      
      authenticationRepository.find.mockResolvedValueOnce({ email: "fakeEmail", password: "fakePassword", id: "fakeId" });
      const email = "fakeEmail";

      const password = await authenticationService.getPassword(email);

      expect(password).toEqual("fakePassword");
      expect(authenticationRepository.find).toHaveBeenCalledTimes(1);
      expect(authenticationRepository.find).toHaveBeenNthCalledWith(1, { email });
    });

    it("should return a rejected promise if no user found", async () => {
      expect.assertions(4);

      authenticationRepository.find.mockResolvedValueOnce(null);
      const email = "fakeEmail";

      try {
        await authenticationService.getPassword(email);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual("Unable to find user with email fakeEmail");
        expect(authenticationRepository.find).toHaveBeenCalledTimes(1);
        expect(authenticationRepository.find).toHaveBeenNthCalledWith(1, { email });
      }
    });

    it("should throw an error if retrieving password failure", async () => {
      expect.assertions(4);

      authenticationRepository.find.mockRejectedValueOnce(new Error("fakeError"));
      const email = "fakeEmail";

      try {
        await authenticationService.getPassword(email);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual("fakeError");
        expect(authenticationRepository.find).toHaveBeenCalledTimes(1);
        expect(authenticationRepository.find).toHaveBeenNthCalledWith(1, { email });
      }
    });
  });
});