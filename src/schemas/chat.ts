import { DataTypes, Sequelize } from "sequelize";

import { Base } from "../settings/database";
import { User } from "./user";
import { ChatRoom } from "./chatroom";

export class Chat extends Base {
    public id!: number;
    public content!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    public userId!: number;
    public chatRoomId!: number;
}
export async function initChatModel(sequelize: Sequelize = Base.sequelize) {
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
        underscored: true,
        indexes: [
            {
                fields: ['user_id'],
                name: 'ix_chat_user_id',
            },
            {
                fields: ['chat_room_id'],
                name: 'ix_chat_chat_room_id',
            },
        ],
    }
    )
}