import Sequelize, { Model, InferAttributes, InferCreationAttributes, ModelStatic } from 'sequelize';
import { UserDal } from './user.interfaces';

type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export interface GroupDal {
    GroupID: string;
    Name: string;
    Permissions: Permission[];
}

export interface Group {
    id: string;
    name: string;
    permissions: Permission[];
}

export interface GroupMapper {
    toDomain(x: GroupDal | null): Group;
    toDalEntity(x: Group | null): GroupDal;
}

export interface GroupModel extends Model<InferAttributes<GroupModel>, InferCreationAttributes<GroupModel>>, GroupDal {
    getUsers: Sequelize.BelongsToGetAssociationMixin<UserDal[]>;
    addUsers: Sequelize.BelongsToSetAssociationMixin<UserDal, string[]>;
}

export interface GroupServiceInterface {
    model:  ModelStatic<GroupModel>;
    mapper: GroupMapper;
}

