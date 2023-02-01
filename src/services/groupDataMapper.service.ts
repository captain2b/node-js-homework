import { Group, GroupDal, GroupMapper } from '../types/group.interfaces';

export default class GroupDataMapperService implements GroupMapper {
    toDomain(entity: GroupDal): Group {
        return {
            id: entity.GroupID,
            name: entity.Name,
            permissions: entity.Permissions
        };
    }

    toDalEntity(domain: Group): GroupDal {
        return {
            GroupID: domain.id,
            Name: domain.name,
            Permissions: domain.permissions
        };
    }
}
