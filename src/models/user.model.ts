import { DataTypes, Sequelize } from 'sequelize';
import {UserModel} from "../types/user.interfaces";
require ('custom-env').env();

const conString = process.env.CON_STRING || '';
console.log(conString);

const sequelize = new Sequelize(conString);

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

const User = sequelize.define<UserModel>('user', {
    PersonID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    Login: DataTypes.STRING,
    Password: DataTypes.STRING,
    Age: {
        type: DataTypes.INTEGER,
        validate: { min: 4, max: 130 }
    },
    IsDeleted: DataTypes.BOOLEAN
}, {
    timestamps: false
});

export default User;
