import { Command } from 'commander';

import {DB_SCHEMA, SequelizeConnection} from './settings/database';


const program = new Command();

async function resetDB(){

    const sequelize = SequelizeConnection.getInstance();
    await sequelize.authenticate();
    await sequelize.dropSchema(DB_SCHEMA, {logging:false});
    await sequelize.createSchema(DB_SCHEMA, {logging:false});
    await sequelize.sync({ force: true ,schema: DB_SCHEMA});

    console.log('reset DB done');
}
program.command('resetDB').action(async () => {await resetDB();});
program.parse(process.argv);