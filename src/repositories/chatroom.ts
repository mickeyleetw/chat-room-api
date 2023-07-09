import { Op, Sequelize } from 'sequelize';

import { AsyncTransaction } from "../settings/transaction";
import { ChatRoomModels, ChatModels } from "../models";
import { ChatRoom, ChatRoomUser, User, Chat } from "../schemas";
import { ResourceNotFoundError } from "../settings/errorhandle";

abstract class AbstractChatRoomRepo {

    abstract getChatRoom(chatRoomId: number): Promise<ChatRoomModels.RetrieveChatRoomDetailModel>;

    abstract getChatRooms(userId: number): Promise<ChatRoomModels.RetrievePartialChatRoomModel[] | []>;

    abstract getCommonChatRoom(userId1: number, userId2: number): Promise<number|null>;

    abstract createChatRoom(userId1: number, userId2: number): Promise<number>;

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

        if (!chatRoom) {
            throw new ResourceNotFoundError('ChatRoom');
        }
        const chatRoomDetailDTO = ChatRoomRepo._convertChatRoomDetailSchematoDTOModel(chatRoom);
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

    async getCommonChatRoom(dispatcherId: number, receiverId: number): Promise<number|null> {
        const chatRoom = await ChatRoom.findOne({
            include: [
                {
                    model: User,
                    as: 'users',
                    where: {
                        id: {
                            [Op.in]: [dispatcherId, receiverId],
                        },
                    },
                },
            ],
            group: 'ChatRoom.id',
            having: Sequelize.literal('COUNT(DISTINCT "users"."id") = 2'),
        });
        return chatRoom ? chatRoom.id : null;
    }

    async createChatRoom(dispatcherId: number, receiverId: number): Promise<number> {

        const chatRoom = await ChatRoom.create();

        await ChatRoomUser.create({ userId: dispatcherId, chatRoomId: chatRoom.id });
        await ChatRoomUser.create({ userId: receiverId, chatRoomId: chatRoom.id });

        return chatRoom.id;
    }
}

