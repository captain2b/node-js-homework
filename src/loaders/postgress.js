import conString from '../configs/connection';

const Pg = require('pg').Client;

const pg = new Pg(conString);

export default () => {
  pg.connect()
    .then(() => console.log('connected'))
    .catch((err) => console.error('connection error', err.stack));

  const valuesArray = [
    [1, 'login', 'pswwd1', 11, false],
    [2, 'login2', 'pswwd1', 41, true],
    [3, 'login3', 'pswwd1', 25, false],
    [4, 'login4', 'pswwd1', 30, false],
  ];
  const text = 'INSERT INTO Users(PersonID, Login, Password, Age, IsDeleted) VALUES($1, $2, $3, $4, $5)';

  // it's an illustration of the SQL skills :TODO remove after 3rd HW
  pg.query('DROP TABLE Users; CREATE TABLE Users( PersonID int, Login varchar(255), Password varchar(255), Age int,  IsDeleted bool)')
    .then((result) => console.log(result))
    .then(() => {
      const promises = valuesArray.map((values) => pg.query(text, values));
      return Promise.allSettled(promises);
    })
    .catch((e) => console.error(e.stack))
    .then((results) => {
      results.forEach((result) => console.log(result));
      pg.end();
    });
};
