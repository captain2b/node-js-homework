import Group from './group.model';
import User from './user.model';

Group.belongsToMany(User, { through: 'UserGroups', foreignKey: 'PersonID' });
User.belongsToMany(Group, { through: 'UserGroups', foreignKey: 'GroupID' });

export { Group, User };
