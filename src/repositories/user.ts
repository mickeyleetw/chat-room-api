import { User } from "../schemas";
import { AsyncTransaction } from "../settings/transaction";
import { ResourceNotFoundError } from "../settings/errorhandle";

import { UserModels } from "../models";

abstract class AbstractUserRepo {

    abstract getUser(userId: number): Promise<UserModels.RetrieveUserModel | Error>;

}

export class UserRepo extends AbstractUserRepo {
    public transaction: AsyncTransaction;

    constructor(transaction: AsyncTransaction) {
        super();
        this.transaction = transaction;
    }

    static _convertUserSchematoDTOModel(user: User): UserModels.RetrieveUserModel {
        return new UserModels.RetrieveUserModel(
            user.id, user.displayName, user.lastLoginAt);
    }

    async getUser(userId: number): Promise<UserModels.RetrieveUserModel | Error> {

        const user =await User.findByPk(userId);
        if (!user) {
            throw new ResourceNotFoundError('User');
        }
        const userDTO = UserRepo._convertUserSchematoDTOModel(user);
        return userDTO;

    }
}