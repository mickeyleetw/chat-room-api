import { DataTypes, Sequelize } from "sequelize";

import { Base } from "../settings/database";
import { User } from "./user";
import { ChatRoom } from "./chatroom";

export class Chat extends Base { }
export function initChatModel(sequelize: Sequelize = Base.sequelize) {
    Chat.init(
        {
            content: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
                references: { model: User, key: 'id' },
                onDelete: 'CASCADE',
            },
            chatRoomId: {
                type: DataTypes.INTEGER,
                references: { model: ChatRoom, key: 'id' },
                onDelete: 'CASCADE',
            },
        }, {
        sequelize: sequelize,
        modelName: 'Chat',
        tableName: 'chat',
        indexes: [
            {
                fields: ['userId'],
                name: 'ix_chat_user_id',
            },
            {
                fields: ['chatRoomId'],
                name: 'ix_chat_chat_room_id',
            },
        ],
    }
    )
}