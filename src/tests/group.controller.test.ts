import app from "../app";
import {mockGroups, mockUsers} from "./mocks";

const request = require("supertest");
let token = 'fake-token';

jest.mock("../middleware/auth", () => ((res: any, req: any, next: () => any) => {
    return next()
}));

jest.mock("../services/group.service", () => {
    const getGroups = jest.fn(() => (mockGroups));
    const getGroup = jest.fn((id: string) => {
        if (id === 'missing') {
            return null;
        }
        return mockGroups[0];
    });
    const getGroupUsers = jest.fn((id: string) => {
        if (id === 'missing') {
            return null;
        }
        return mockUsers;
    });
    const createGroup = jest.fn((body) => (body));
    const addUsersToGroup = jest.fn((id, body) => {
        if (id === 'missing') {
            return null;
        }
        return body;
    });
    const updateGroup = jest.fn((id, body) => body);
    const deleteGroup = jest.fn((id) => {
        if (id === 'missing') {
            return null;
        }
        return id;
    });
    return jest.fn().mockImplementation(() => ({
        getGroups,
        getGroup,
        getGroupUsers,
        createGroup,
        addUsersToGroup,
        deleteGroup,
        updateGroup,
    }));
});

describe("GET groups", () => {
    test("It should return 200", async () => {
        const response = await request(app)
            .get("/groups/")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockGroups);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });
});

describe("GET group by id", () => {
    test("It should return 200", async () => {
        const response = await request(app)
            .get("/groups/1")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockGroups[0]);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

    test("It should return 204", async () => {
        const response = await request(app)
            .get("/groups/missing")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(204);
        expect(response.body).toEqual({});
    });
});

describe("GET users by group", () => {
    test("It should return 200", async () => {
        const response = await request(app)
            .get("/groups/1/users")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockUsers);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

    test("It should return 204", async () => {
        const response = await request(app)
            .get("/groups/missing/users")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(204);
        expect(response.body).toEqual({});
    });
});

describe("Create group", () => {
    test("It should return 400 and validation error", async () => {
        const response = await request(app)
            .post("/groups/")
            .set('x-access-token', token)
            .send({name: 'john'});
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual(expect.stringContaining('Error validating request body'));
    });

    test("It should return 400", async () => {
        const response = await request(app)
            .post("/groups/")
            .set('x-access-token', token)
            .send({
                name: 'group1',
                permissions: ['error']
            });
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual(expect.stringContaining('Error validating request body'));
        expect(response.text).toEqual(expect.stringContaining('permissions[0]'));
    });

    test("It should return 200", async () => {
        const body = {
            name: 'group1',
            permissions: ['READ']
        };
        const response = await request(app)
            .post("/groups/")
            .set('x-access-token', token)
            .send(body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(body);
    });
});

describe("Add user to a group", () => {

    test("It should return 200", async () => {
        const body = {
            userIds: ['userID']
        };
        const response = await request(app)
            .post("/groups/1/users")
            .set('x-access-token', token)
            .send(body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(['userID']);
    });

    test("It should return 204", async () => {
        const response = await request(app)
            .post("/groups/missing/users")
            .set('x-access-token', token)
            .send({userIds: ['userID']});
        expect(response.statusCode).toBe(204);
        expect(response.body).toEqual({});
    });
});

describe("Delete group", () => {

    test("It should return 200", async () => {
        const response = await request(app)
            .delete("/groups/1")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
        expect(response.text).toEqual('1');
    });

    test("It should return 204", async () => {
        const response = await request(app)
            .delete("/groups/missing")
            .set('x-access-token', token);
        expect(response.statusCode).toBe(204);
    });
});

describe("Update group", () => {
    test("It should return 200", async () => {
        const body = {
            name: 'groupName',
            permissions: []
        };
        const response = await request(app)
            .put("/groups/1")
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
            .put("/groups/1")
            .set('x-access-token', token)
            .send(body);
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual(expect.stringContaining('Error validating request body'));
    });
});