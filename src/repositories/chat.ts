import { AsyncTransaction } from "../settings/transaction";
import { Chat } from "../schemas";


abstract class AbstractChatRepo {

    abstract createChat(userId1: number, userId2: number,message:string): Promise<number>;

}

export class ChatRepo extends AbstractChatRepo {
    public transaction: AsyncTransaction;

    constructor(transaction: AsyncTransaction) {
        super();
        this.transaction = transaction;
    }

    async createChat(userId1: number, chatRoomId: number,message:string): Promise<number> {
        const chat = await Chat.create({content:message,userId:userId1,chatRoomId:chatRoomId});
        return chat.id;
    }
}