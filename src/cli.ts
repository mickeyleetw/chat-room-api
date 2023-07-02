import * as path from 'path';

import { DB_SCHEMA, SequelizeConnection,AsyncTransaction } from './settings/database';
import { initUserModel, initChatModel, initChatRoomModel, initChatRoomUserModel } from './schemas';
import { processCSV,importData } from './data_importer';

async function resetDB() {

    const sequelize = await SequelizeConnection.connect();
    sequelize.dropSchema(DB_SCHEMA, { logging: false });
    sequelize.createSchema(DB_SCHEMA, { logging: false });
    await sequelize.sync({ force: true, schema: DB_SCHEMA });
    initChatRoomModel(sequelize);
    initUserModel(sequelize);
    initChatRoomUserModel(sequelize);
    initChatModel(sequelize);
    await sequelize.sync({ force: true, schema: DB_SCHEMA });

    await import_data();
    console.log('reset DB done');
}

async function import_data():Promise<void>{
    const appPath = `${path.resolve(__dirname, '..')}/src`;
    console.log(appPath);
    const tableSets=processCSV(appPath);
    const transaction=new AsyncTransaction();
    importData(transaction,tableSets);
    await transaction.sequelize.sync();
    await transaction.commit();


}

// program.command('resetDB').action(async () => {await resetDB();});
// program.parse(process.argv);
resetDB();



// Promise.all([resetDB()]);