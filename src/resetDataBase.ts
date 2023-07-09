import * as path from 'path';

import { DB_SCHEMA, SequelizeConnection } from './settings/database';
import { initUserModel,User, initChatModel,Chat, initChatRoomModel,ChatRoom, initChatRoomUserModel,ChatRoomUser } from './schemas';
import { processCSV, importData } from './data_importer';
import { Sequelize } from 'sequelize';

async function resetDB() {
    const sequelize = await SequelizeConnection.connect();
    
    console.log('Reset DB starting...');
    await initDB(sequelize);
    console.log('Create DB done');

    console.log('Importing CSV...');
    await importCSV(sequelize);
    console.log('Importing CSV done');

    await sequelize.close();
}

async function initDB(sequelize:Sequelize): Promise<void>  {
    try{
        await initChatRoomUserModel(sequelize);
        await initChatRoomModel(sequelize);
        await initUserModel(sequelize);
        await initChatModel(sequelize);
        await sequelize.sync({ force: true, schema: DB_SCHEMA });
        await sequelize.sync({ force: true, schema: DB_SCHEMA });
    }catch(e){
        console.log(e);
        throw e;
    }
}

async function importCSV(sequelize: Sequelize): Promise<void> {
    const appPath = `${path.resolve(__dirname, '..')}/src`;

    try{
        const tableSets = processCSV(appPath);
        await importData(sequelize, tableSets);
    }catch(e){
        console.log(e);
        throw e;
    }
}

resetDB()