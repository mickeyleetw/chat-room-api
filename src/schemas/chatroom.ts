
import { Base } from "../settings/database";
import { User } from "./user";

export class ChatRoom extends Base { }
ChatRoom.init(
    {},
    {
        sequelize: Base.sequelize,
        modelName: 'ChatRoom',
        tableName: 'chat_room'
    }
)

ChatRoom.belongsToMany(User, { through: {model:'ChatRoomUser',unique:true} });