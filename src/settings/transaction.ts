import {Transaction,Sequelize } from "sequelize";
import {SequelizeConnection,DB_SCHEMA} from './database';
import { initUserModel, initChatModel, initChatRoomModel, initChatRoomUserModel } from '../schemas';

// Create AsyncTransaction class for transaction management
export class AsyncTransaction extends Transaction {
  
    public sequelize: Sequelize = SequelizeConnection.getInstance();
    constructor() {
      super(SequelizeConnection.getInstance(), {
        isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        autocommit: false,
      });
    }

    async initDB(): Promise<void>  {
        await initChatRoomModel(this.sequelize);
        await initUserModel(this.sequelize);
        await initChatRoomUserModel(this.sequelize);
        await initChatModel(this.sequelize);
        await this.sequelize.sync({ force: true, schema: DB_SCHEMA });
    }
  }