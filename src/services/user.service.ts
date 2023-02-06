import { User, UserMapper, UserModel, UserServiceInterface } from '../types/user.interfaces';
import { FindOptions, ModelStatic, Op } from 'sequelize';
import { ParsedQs } from 'qs';

const uuid = require('uuid');

export default class UserService implements UserServiceInterface {
    model: ModelStatic<UserModel>;
    mapper: UserMapper;

    constructor(userModel: ModelStatic<UserModel>, userDataMapper: UserMapper) {
        this.model = userModel;
        this.mapper = userDataMapper;
    }

    async createUser(newUser: User): Promise<User | Error> {
        try {
            const id = uuid.v4();
            const user = await this.model.create(
                this.mapper.toDalEntity({ ...newUser, id })
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

    async updateUser(id: string, update: User): Promise<User | Error> {
        try {
            let user = await this.model.findByPk(id);
            const dalUser = this.mapper.toDalEntity({ ...update, id });
            if (user) {
                await user.update(dalUser);
            } else {
                user = await this.model.create(dalUser);
            }
            return this.mapper.toDomain(user);
        } catch (e) {
            let message = 'Unknown Error';
            if (e instanceof Error) {
                message = e.message;
            }
            return new Error(message);
        }
    }

    async deleteUser(id: string): Promise<UserModel | Error | null> {
        try {
            const user = await this.model.findByPk(id);
            if (user) {
                await user.update({ IsDeleted: true });
            }
            return user;
        } catch (e) {
            let message = 'Unknown Error';
            if (e instanceof Error) {
                message = e.message;
            }
            return new Error(message);
        }
    }

    async getUser(id: string): Promise<User | Error> {
        try {
            const user = await this.model.findByPk(id);
            return this.mapper.toDomain(user);
        } catch (e) {
            let message = 'Unknown Error';
            if (e instanceof Error) {
                message = e.message;
            }
            return new Error(message);
        }
    }

    async getUsers(loginSubstring?: string | ParsedQs | string[] | ParsedQs[],
        limit?: string | ParsedQs | string[] | ParsedQs[]): Promise<User[] | Error> {
        if ((loginSubstring && typeof loginSubstring !== 'string')
            || (limit && typeof limit !== 'string')
        ) {
            throw new Error('input type is not valid');
        }
        const options: FindOptions = {
            order: [
                ['Login', 'DESC']
            ]
        };
        if (loginSubstring) {
            options.where = {
                'Login': {
                    [Op.substring]: loginSubstring
                }
            };
        }
        if (limit) {
            options.limit = Number(limit);
        }
        try {
            const users = await this.model.findAll(options);
            return users.map((user) => this.mapper.toDomain(user));
        } catch (e) {
            let message = 'Unknown Error';
            if (e instanceof Error) {
                message = e.message;
            }
            return new Error(message);
        }
    }
}
