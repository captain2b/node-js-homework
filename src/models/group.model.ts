import { DataTypes } from 'sequelize';
import { GroupModel } from '../types/group.interfaces';
import sequelize from '../loaders/sequelize';
require('custom-env').env();

const Group = sequelize.define<GroupModel>('Group', {
    GroupID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    Name: DataTypes.STRING,
    Permissions: DataTypes.ARRAY(DataTypes.STRING)
}, {
    timestamps: false
});

export default Group;
