import { asyncUnitOfWork } from '../dependencyInjections';
import { ChatRoomModels } from '../models';


export class ChatRoomUseCase {

    static async getUserChatRooms(userId: number): Promise<ChatRoomModels.RetrievePartialChatRoomModel[]|[]> {
        const auow = new asyncUnitOfWork();
        await auow.userRepo.getUser(userId);
        const userChatRooms=await auow.chatRoomRepo.getChatRooms(userId);
        await auow.unitTransaction.commit();
        return userChatRooms;
    }

    static async getChatRoom(chatRoomId: number): Promise<ChatRoomModels.RetrieveChatRoomDetailModel> {
        const auow = new asyncUnitOfWork();
        const chatRoomDetail=await auow.chatRoomRepo.getChatRoom(chatRoomId);
        await auow.unitTransaction.commit();
        return chatRoomDetail;
    }

}