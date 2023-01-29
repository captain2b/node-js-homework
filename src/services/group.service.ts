import { ModelStatic } from 'sequelize';
import { Group, GroupMapper, GroupModel, GroupServiceInterface } from '../types/group.interfaces';
import { UserDal } from '../types/user.interfaces';
import sequelize from '../loaders/sequelize';

const uuid = require('uuid');

export default class GroupService implements GroupServiceInterface {
    model: ModelStatic<GroupModel>;
    mapper: GroupMapper;

    constructor(userModel: ModelStatic<GroupModel>, groupDataMapper: GroupMapper) {
        this.model = userModel;
        this.mapper = groupDataMapper;
    }

    async getGroups(): Promise<Group[] | Error> {
        try {
            const groups = await this.model.findAll();
            return groups.map((group) => this.mapper.toDomain(group));
        } catch (e) {
            let message = 'Unknown Error';
            if (e instanceof Error) {
                message = e.message;
            }
            return new Error(message);
        }
    }

    async getGroup(id: string): Promise<Group | Error> {
        try {
            const group = await this.model.findByPk(id);
            return this.mapper.toDomain(group);
        } catch (e) {
            let message = 'Unknown Error';
            if (e instanceof Error) {
                message = e.message;
            }
            return new Error(message);
        }
    }

    async createGroup(newGroup: Group): Promise<Group | Error> {
        try {
            const id = uuid.v4();
            const user = await this.model.create(
                this.mapper.toDalEntity({ ...newGroup, id })
            );
            return this.mapper.toDomain(user);
        } catch (e) {
            let message = 'Unknown Error';
            if (e instanceof Error) {
                message = e.message;
            }
            return new Error(message);
        }
    }


    async deleteGroup(id: string): Promise<GroupModel | Error | null> {
        try {
            const group = await this.model.findByPk(id);
            if (group) {
                await group.destroy();
            }
            return group;
        } catch (e) {
            let message = 'Unknown Error';
            if (e instanceof Error) {
                message = e.message;
            }
            return new Error(message);
        }
    }

    async updateGroup(id: string, update: Group): Promise<Group | Error> {
        try {
            let group = await this.model.findByPk(id);
            const dalGroup = this.mapper.toDalEntity({ ...update, id });
            if (group) {
                await group.update(dalGroup);
            } else {
                group = await this.model.create(dalGroup);
            }
            return this.mapper.toDomain(group);
        } catch (e) {
            let message = 'Unknown Error';
            if (e instanceof Error) {
                message = e.message;
            }
            return new Error(message);
        }
    }

    async getGroupUsers(id: string): Promise<UserDal[] | null | undefined | Error> {
        try {
            const group = await this.model.findByPk(id);
            // @ts-ignore
            return group?.getUsers({ joinTableAttributes: [] });
        } catch (e) {
            let message = 'Unknown Error';
            if (e instanceof Error) {
                message = e.message;
            }
            return new Error(message);
        }
    }

    async addUsersToGroup(groupId: string, userIds: string[]): Promise<UserDal[] | null | undefined | Error> {
        try {
            const result = await sequelize.transaction(async (t) => {
                const group = await this.model.findByPk(groupId, { transaction: t });
                await group?.addUsers(userIds, { transaction: t });

                // @ts-ignore
                return group?.getUsers({ joinTableAttributes: [], transaction: t });
            });
            return result;
        } catch (e) {
            let message = 'Unknown Error. Transaction is aborted';
            if (e instanceof Error) {
                message = e.message;
            }
            return new Error(message);
        }
    }
}
