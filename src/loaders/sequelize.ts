import { Sequelize } from 'sequelize';

require('custom-env').env();

const conString = process.env.CON_STRING || '';

const sequelize = new Sequelize(conString);

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

export default sequelize;

