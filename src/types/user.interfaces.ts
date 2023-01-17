
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
    toDomain(x: UserDal): User;
    toDalEntity(x: User): UserDal;
}

export interface UserServiceInterface {
    model:  any;
    mapper: UserMapper;
}
