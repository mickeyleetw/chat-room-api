import { DataTypes } from "sequelize";

import { Base } from "../settings/database";
import { ChatRoom } from "./chatroom";

export class User extends Base { }
User.init(
    {
        displayName: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
    sequelize: Base.sequelize,
    modelName: 'User',
    tableName: 'user',
    indexes: [
        {
            fields: ['displayName'],
            name: 'ix_user_display_name',
        },
        {
            fields: ['lastLoginAt'],
            name: 'ix_user_last_login_at',
        },
    ],
}
)

// Create ChatRoomUser class for many to many relationship
export class ChatRoomUser extends Base { }
ChatRoomUser.init(
    {
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
    sequelize: Base.sequelize,
    modelName: 'ChatRoomUser',
    tableName: 'chat_room_user',
    indexes: [
        {
            unique: true,
            fields: ['userId', 'chatRoomId'],
            name: 'user_chat_room_user_id_chatroom_id_key',
        },
    ],
    validate: {
        async checkChatRoomUserLimit() {
            if (this.chatRoomId && this.isNewRecord) {
                const count = ChatRoomUser.count({ where: { chatRoomId: this.chatRoomId } });
                if (await count >= 2) {
                    throw new Error('A chatroom can only have two users.');
                }
            }
        }
    },
}
)
User.belongsToMany(ChatRoom, { through: { model: 'ChatRoomUser', unique: true } });