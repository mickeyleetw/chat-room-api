import { DataTypes, Sequelize } from "sequelize";

import { Base } from "../settings/database";
import { ChatRoom } from "./chatroom";

export class User extends Base {
    public userKey!: string;
    public displayName!: string;
    public lastLoginAt!: Date;
    public createdAt!: Date;
    public updatedAt!: Date;
}
export function initUserModel(sequelize: Sequelize=Base.sequelize) {
    User.init(
        {
            userKey: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            displayName: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            lastLoginAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate:'CASCADE',
            }
        }, {
        sequelize: sequelize,
        modelName: 'User',
        tableName: 'user',
        underscored: true,
        indexes: [
            {
                fields: ['display_name'],
                name: 'ix_user_display_name',
            },
            {
                fields: ['last_login_at'],
                name: 'ix_user_last_login_at',
            },
            {
                fields: ['user_key'],
                name: 'ix_user_user_key',
            },
        ],
    }
    )
    User.belongsToMany(ChatRoom, { through: ChatRoomUser, targetKey: 'id', as: 'chatRooms' });
}

// Create ChatRoomUser class for many to many relationship
export class ChatRoomUser extends Base { 
    public userId!: number;
    public chatRoomId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}
export function initChatRoomUserModel(sequelize: Sequelize=Base.sequelize) {
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
        sequelize: sequelize,
        underscored: true,
        modelName: 'ChatRoomUser',
        tableName: 'chat_room_user',
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'chat_room_id'],
                name: 'user_chat_room_user_id_chat_room_id_key',
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
    );
}
