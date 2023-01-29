require('custom-env').env();

const conString = process.env.CON_STRING;

const Pg = require('pg').Client;

export default () => {
    const pg = conString && new Pg(conString);

    if (!pg) {
        console.error('connection string were not provided');
    }

    pg.connect()
        .then(() => console.log('connected'))
        .catch((err: Error) => console.error('connection error', err.stack));

    const valuesArray = [
        ['1', 'login', 'pswwd1', 11, false],
        ['2', 'login2', 'pswwd1', 41, true],
        ['3', 'login3', 'pswwd1', 25, false],
        ['4', 'login4', 'pswwd1', 30, false]
    ];
    const text = 'INSERT INTO "Users"("PersonID", "Login", "Password", "Age", "IsDeleted") VALUES($1, $2, $3, $4, $5)';

    pg.query('CREATE TABLE IF NOT EXISTS "Users"( "PersonID" varchar(255) NOT NULL UNIQUE, "Login" varchar(255), "Password" varchar(255), "Age" int,  "IsDeleted" bool)')
        .then((result: any) => console.log(result))
        .then(() => {
            const promises = valuesArray.map((values) => pg.query(text, values));
            return Promise.allSettled(promises);
        })
        .catch((e: Error) => console.error(e.stack))
        .then((results: any[]) => {
            results.forEach((result) => console.log(result));
        });

    const groupsArray = [
        ['1', 'group', '{READ, WRITE, DELETE}'],
        ['2', 'group2', '{READ}']
    ];
    const groupText = 'INSERT INTO "Groups" ("GroupID", "Name", "Permissions") VALUES($1, $2, $3)';

    pg.query('CREATE TABLE IF NOT EXISTS "Groups"( "GroupID" varchar(255) NOT NULL UNIQUE, "Name" varchar(255), "Permissions" varchar(255)[])')
        .then((result: any) => console.log(result))
        .then(() => {
            const promises = groupsArray.map((values) => pg.query(groupText, values));
            return Promise.allSettled(promises);
        })
        .catch((e: Error) => console.error(e.stack))
        .then((results: any[]) => {
            results.forEach((result) => console.log(result));
        });

    const usersGroupsArray = [
        ['1', '1', new Date(), new Date()]
    ];
    const usersGroupText = 'INSERT INTO "UserGroups" ("GroupID", "PersonID", "createdAt", "updatedAt") VALUES($1, $2, $3, $4)';

    pg.query('CREATE TABLE IF NOT EXISTS "UserGroups"(\n' +
        ' "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,\n' +
        ' "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,' +
        ' "PersonID" varchar(255) REFERENCES "Users" ("PersonID") ON DELETE CASCADE ON UPDATE CASCADE,\n' +
        ' "GroupID" varchar(255) REFERENCES "Groups" ("GroupID") ON DELETE CASCADE ON UPDATE CASCADE,\n' +
        ' PRIMARY KEY ("PersonID","GroupID"))')
        .then((result: any) => console.log(result))
        .then(() => {
            const promises = usersGroupsArray.map((values) => pg.query(usersGroupText, values));
            return Promise.allSettled(promises);
        })
        .catch((e: Error) => console.error(e.stack))
        .then((results: any[]) => {
            results.forEach((result) => console.log(result));
            pg.end();
        });
};
