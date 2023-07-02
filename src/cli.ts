import { Command } from 'commander';

import {DB_SCHEMA, SequelizeConnection} from './settings/database';
import {initUserModel,initChatModel,initChatRoomModel,initChatRoomUserModel} from './schemas';

async function resetDB(){

    const sequelize =await SequelizeConnection.connect();
    sequelize.dropSchema(DB_SCHEMA, {logging:false});
    sequelize.createSchema(DB_SCHEMA, {logging:false});
    await sequelize.sync({ force: true ,schema: DB_SCHEMA});
    initChatRoomModel(sequelize);
    initUserModel(sequelize);
    initChatRoomUserModel(sequelize);
    initChatModel(sequelize);
    await sequelize.sync({ force: true ,schema: DB_SCHEMA});

    console.log('reset DB done');
}
// program.command('resetDB').action(async () => {await resetDB();});
// program.parse(process.argv);
resetDB();

// Promise.all([resetDB()]);