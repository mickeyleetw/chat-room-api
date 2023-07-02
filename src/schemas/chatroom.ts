
import { Sequelize } from "sequelize";
import { Base } from "../settings/database";

export class ChatRoom extends Base {}
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
    // ChatRoom.belongsToMany(User, { through: {model:'ChatRoomUser',unique:true} });
}

