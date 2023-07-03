import { AsyncTransaction } from "../settings/database";
import { ChatRoomModels } from "../models";

abstract class AbstractChatRoomRepo {

    abstract getChatRooms(user_id: number): Promise<ChatRoomModels.RetrieveChatRoomModel[]|[]>;

}

export class ChatRoomRepo extends AbstractChatRoomRepo {
    public transaction: AsyncTransaction;

    constructor(transaction: AsyncTransaction) {
        super();
        this.transaction = transaction;
    }

    async getChatRooms(user_id: number): Promise<ChatRoomModels.RetrieveChatRoomModel[]|[]>{
        console.log(user_id);
        return [];
    }
}