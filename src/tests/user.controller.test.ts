import app from "../app";
import {mockGroups, mockUsers} from "./mocks";

const request = require("supertest");
let token = 'fake-token';

jest.mock("../middleware/auth", () => ((res: any, req: any, next: () => any) => {
    return next()
}));

jest.mock("../services/user.service", () => {
    const getUsers = jest.fn((loginSub, limit) => ({loginSub, limit, data: mockUsers}));
    const getUser = jest.fn((id: string) => {
        if (id === 'missing') {
            return null;
        }
        return mockUsers[0];
    });
    const createUser = jest.fn((body) => (body));
    const updateUser = jest.fn((id, body) => body);
    const deleteUser = jest.fn((id) => {
        if (id === 'missing') {
            return null;
        }
        return id;
    });
    return jest.fn().mockImplementation(() => ({
        getUsers,
        getUser,
        createUser,
        deleteUser,
        updateUser,
    }));
});

describe("GET users", () => {
    test("It should return 200", async () => {
        const response = await request(app)
            .get("/users/")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({loginSub: undefined, limit: undefined, data: mockUsers});
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

    test("It should return 200 with limits", async () => {
        const response = await request(app)
            .get("/users/?loginSubstring=loginSubstring&limit=10")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({loginSub: 'loginSubstring', limit: '10', data: mockUsers});
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });
});

describe("GET user by id", () => {
    test("It should return 200", async () => {
        const response = await request(app)
            .get("/users/1")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockUsers[0]);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

    test("It should return 204", async () => {
        const response = await request(app)
            .get("/users/missing")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(204);
        expect(response.body).toEqual({});
    });
});

describe("Create user", () => {
    test("It should return 400 and validation error", async () => {
        const response = await request(app)
            .post("/users/")
            .set('x-access-token', token)
            .send({name: 'john'});
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual(expect.stringContaining('Error validating request body'));
    });

    test("It should return 400 w password error", async () => {
        const body = {
            login: 'login',
            password: 'pswd',
            age: 30,
            isDeleted: false,
        };
        const response = await request(app)
            .post("/users/")
            .set('x-access-token', token)
            .send(body);
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual(expect.stringContaining('Error validating request body'));
        expect(response.text).toEqual(expect.stringContaining(' fails to match the required pattern:'));
    });

    test("It should return 200", async () => {
        const body = {
            login: 'login',
            password: '1pswd',
            age: 30,
            isDeleted: false,
        };
        const response = await request(app)
            .post("/users/")
            .set('x-access-token', token)
            .send(body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(body);
    });
});

describe("Delete user", () => {

    test("It should return 200", async () => {
        const response = await request(app)
            .delete("/users/1")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
        expect(response.text).toEqual('1');
    });

    test("It should return 204", async () => {
        const response = await request(app)
            .delete("/users/missing")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(204);
    });
});

describe("Update user", () => {
    test("It should return 200", async () => {
        const body = {
            login: 'login',
            isDeleted: true
        };
        const response = await request(app)
            .put("/users/1")
            .set('x-access-token', token)
            .send(body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(body);
    });

    test("It should return validation error", async () => {
        const body = {
            validation: 'error',
        };
        const response = await request(app)
            .put("/users/1")
            .set('x-access-token', token)
            .send(body);
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual(expect.stringContaining('Error validating request body'));
    });
});