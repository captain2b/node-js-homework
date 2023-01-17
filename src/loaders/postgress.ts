require ('custom-env').env();

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
    const text = 'INSERT INTO Users("PersonID", "Login", "Password", "Age", "IsDeleted") VALUES($1, $2, $3, $4, $5)';

    // it's an illustration of the SQL skills :TODO remove after 3rd HW
    pg.query('DROP TABLE Users; CREATE TABLE Users( "PersonID" varchar(255), "Login" varchar(255), "Password" varchar(255), "Age" int,  "IsDeleted" bool)')
        .then((result: any) => console.log(result))
        .then(() => {
            const promises = valuesArray.map((values) => pg.query(text, values));
            return Promise.allSettled(promises);
        })
        .catch((e: Error) => console.error(e.stack))
        .then((results: any[]) => {
            results.forEach((result) => console.log(result));
            pg.end();
        });
};
