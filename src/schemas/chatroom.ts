
import { Sequelize } from "sequelize";
import { Base } from "../settings/database";
import { User,ChatRoomUser } from "./user";
import { Chat } from "./chat";

export class ChatRoom extends Base {
    public id!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public users!: User[];
    public chats: Chat[];
}
export function initChatRoomModel(sequelize: Sequelize=Base.sequelize) {
    ChatRoom.init(
        {},
        {
            sequelize: sequelize,
            underscored: true,
            modelName: 'ChatRoom',
            tableName: 'chat_room'
        }
    );
    ChatRoom.belongsToMany(User, { through: ChatRoomUser, targetKey: 'id', as: 'users' });

}

Object.defineProperty(ChatRoom.prototype, 'users', {
    get: async function() {
      const chatRoomUsers = await this.getUsers();
      return chatRoomUsers.map(chatRoomUser => chatRoomUser.User);
    },
    enumerable: true,
  });