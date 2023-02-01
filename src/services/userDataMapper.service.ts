import { User, UserDal, UserMapper } from '../types/user.interfaces';

export default class UserDataMapperService implements UserMapper {
    toDomain(entity: UserDal): User {
        return {
            login: entity.Login,
            password: entity.Password,
            age: entity.Age,
            isDeleted: entity.IsDeleted,
            id: entity.PersonID
        };
    }

    toDalEntity(domain: User): UserDal {
        return {
            Login: domain.login,
            Password: domain.password,
            Age: domain.age,
            IsDeleted: domain.isDeleted,
            PersonID: domain.id
        };
    }
}
