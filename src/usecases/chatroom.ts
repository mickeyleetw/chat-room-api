import { asyncUnitOfWork } from '../dependencyInjections';
import { ChatRoomModels } from '../models';


export class ChatRoomUseCase {

    static async getUserChatRooms(user_id: number): Promise<ChatRoomModels.RetrieveChatRoomModel[]|[]> {
        const auow = new asyncUnitOfWork();
        await auow.userRepo.getUser(user_id);
        const userChatRooms=await auow.chatRoomRepo.getChatRooms(user_id);
        await auow.unitTransaction.commit();
        return userChatRooms;
    }

}