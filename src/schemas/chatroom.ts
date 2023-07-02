
import { Model, DataTypes, Sequelize } from "sequelize";
import { DB_SCHEMA, Base } from "../settings/database";
import { User } from "./user";

export class ChatRoom extends Base {}
export function initChatRoomModel(sequelize: Sequelize=Base.sequelize) {
    ChatRoom.init(
        {},
        {
            sequelize: sequelize,
            modelName: 'ChatRoom',
            tableName: 'chat_room'
        }
    );
    // ChatRoom.belongsToMany(User, { through: {model:'ChatRoomUser',unique:true} });
}

