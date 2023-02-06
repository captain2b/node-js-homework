import { DataTypes } from 'sequelize';
import { UserModel } from '../types/user.interfaces';
import sequelize from '../loaders/sequelize';
require('custom-env').env();


const User = sequelize.define<UserModel>('User', {
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
