import { AsyncTransaction } from "../settings/database";
import { ChatRoomModels,ChatModels } from "../models";
import { ChatRoom, ChatRoomUser, User,Chat } from "../schemas";

abstract class AbstractChatRoomRepo {

    abstract getChatRoom(chatRoomId: number): Promise<ChatRoomModels.RetrieveChatRoomDetailModel>;

    abstract getChatRooms(userId: number): Promise<ChatRoomModels.RetrievePartialChatRoomModel[] | []>;

}

export class ChatRoomRepo extends AbstractChatRoomRepo {
    public transaction: AsyncTransaction;

    constructor(transaction: AsyncTransaction) {
        super();
        this.transaction = transaction;
    }

    static _convertChatRoomSchematoDTOModel(chatRoom: ChatRoom): ChatRoomModels.RetrievePartialChatRoomModel {
        return new ChatRoomModels.RetrievePartialChatRoomModel(
            chatRoom.users, chatRoom.createdAt, chatRoom.id)
    }

    static _convertChatRoomDetailSchematoDTOModel(chatRoom: ChatRoom): ChatRoomModels.RetrieveChatRoomDetailModel {
        return new ChatRoomModels.RetrieveChatRoomDetailModel(
            chatRoom.chats.map((chat) => new ChatModels.RetrieveChatModel(chat.content, chat.createdAt, chat.userId, chat.id)),   
            chatRoom.createdAt, chatRoom.id)
    }


    async getChatRoom(chatRoomId: number): Promise<ChatRoomModels.RetrieveChatRoomDetailModel> {
        const chatRoom = await ChatRoom.findOne({
            where: { id: chatRoomId },
            include: [
              {
                model: Chat,
                as: 'chats',
              },
              {
                model: User,
              },
            ],
          });
        const chatRoomDetailDTO =ChatRoomRepo._convertChatRoomDetailSchematoDTOModel(chatRoom);
        return chatRoomDetailDTO;
    }


    async getChatRooms(userId: number): Promise<ChatRoomModels.RetrievePartialChatRoomModel[] | []> {

        const chatRooms = await ChatRoom.findAll({
            include: [
                {
                    model: ChatRoomUser,
                    where: {
                        userId: userId
                    },
                    include: [
                        {
                            model: User
                        }],
                    required: true
                }
            ]
        });
        const chatRoomDTOList = chatRooms.map((chatRoom) => ChatRoomRepo._convertChatRoomSchematoDTOModel(chatRoom));
        return chatRoomDTOList;

    }
}