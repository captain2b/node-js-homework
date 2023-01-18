import {Model, InferAttributes, InferCreationAttributes, ModelStatic} from "sequelize";

export interface UserDal {
    Login: string;
    Password: string;
    PersonID: string;
    Age: number;
    IsDeleted: boolean;
}

export interface User {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

export interface UserMapper {
    toDomain(x: UserDal | null): User;
    toDalEntity(x: User | null): UserDal;
}

export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>>, UserDal {}

export interface UserServiceInterface {
    model:  ModelStatic<UserModel>;
    mapper: UserMapper;
}

