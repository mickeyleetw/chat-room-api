import * as path from 'path';

import { DB_SCHEMA, SequelizeConnection } from './settings/database';
import { initUserModel, initChatModel, initChatRoomModel, initChatRoomUserModel } from './schemas';
import { processCSV, importData } from './data_importer';
import { Sequelize } from 'sequelize';

async function resetDB() {
    console.log('Reset DB starting...');
    const sequelize = await SequelizeConnection.connect();
    Promise.all([await initChatRoomModel(sequelize), await initUserModel(sequelize), await initChatRoomUserModel(sequelize), await initChatModel(sequelize)]);
    await sequelize.sync({ force: true, schema: DB_SCHEMA });
    console.log('Create DB done');
    console.log('Importing CSV...');
    try {
        await importCSV(sequelize);
    } catch (e) {
        console.log(e);
        throw e;
    }
    await sequelize.close();
    console.log('Importing CSV done');
}

async function importCSV(sequelize: Sequelize): Promise<void> {
    const appPath = `${path.resolve(__dirname, '..')}/src`;
    const tableSets = processCSV(appPath);
    await importData(sequelize, tableSets);
}

resetDB()