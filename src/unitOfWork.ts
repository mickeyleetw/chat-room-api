
import { ChatRoomRepo } from './repositories';
import { UserRepo } from './repositories/user';
import { AsyncTransaction } from './settings/database';


export class AsyncSequelizeUnitOfWork {
    public unitTransaction: AsyncTransaction;
    public chatRoomRepo: ChatRoomRepo;
    public userRepo:UserRepo;

    constructor() {
        const transaction = new AsyncTransaction();
        this.unitTransaction = transaction;
        this.chatRoomRepo = new ChatRoomRepo(transaction);
        this.userRepo = new UserRepo(transaction);
    }
}