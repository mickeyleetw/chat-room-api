
import { ChatRoomRepo } from './repositories';
import { UserRepo } from './repositories/user';
import { ChatRepo } from './repositories/chat';
import { AsyncTransaction } from './settings/transaction';


export class AsyncSequelizeUnitOfWork {
    public unitTransaction: AsyncTransaction;
    public chatRoomRepo: ChatRoomRepo;
    public userRepo:UserRepo;
    public chatRepo:ChatRepo;

    constructor() {
        const transaction = new AsyncTransaction();
        Promise.resolve(transaction.initDB());
        this.unitTransaction = transaction;
        this.chatRoomRepo = new ChatRoomRepo(transaction);
        this.userRepo = new UserRepo(transaction);
        this.chatRepo = new ChatRepo(transaction);
    }
}