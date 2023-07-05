import { asyncUnitOfWork } from '../dependencyInjections';
import { ChatModels } from '../models';


export class ChatUseCase {

    static async createUserChat(userId: number, userMessage: ChatModels.CreateChatModel): Promise<number> {
        let userChatRoomId;
        const auow = new asyncUnitOfWork();
        userChatRoomId = await auow.chatRoomRepo.getCommonChatRoom(userId, userMessage.receiverId);
        if (!userChatRoomId) {
            userChatRoomId = await auow.chatRoomRepo.createChatRoom(userId, userMessage.receiverId);
        }
        const chatId = await auow.chatRepo.createChat(userId, userChatRoomId, userMessage.message,);
        await auow.unitTransaction.commit();
        return chatId;
    }

}