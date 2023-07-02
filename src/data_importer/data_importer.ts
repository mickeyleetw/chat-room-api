import * as fs from 'fs';
import moment from 'moment';
import { snakeCase, camelCase } from 'lodash';

import { dataList } from './data_list';
import { DB_SCHEMA, AsyncTransaction } from '../settings/database';

export function processCSV(appPath: string): object[] {
    const tableSets: object[] = [];
    for (const path of dataList) {
        const filePath= `${appPath}/${path}`;
        const fileName: string = filePath.split('/').pop();
        const tableName: string = fileName.split('.csv')[0];
        const f: string = fs.readFileSync(filePath, { encoding: 'utf8' });
        const data: string[][] = f.split('\n').map((line) => line.split(','));
        if (tableName == 'user') {
            if (data[0].includes('id')) {
                const targetIndex = data[0].indexOf('id');
                data[0][targetIndex] = 'user_key';
            }
            if (data[0].includes('createAt')) {
                const targetIndex = data[0].indexOf('createAt');
                data[0][targetIndex] = 'createdAt';
            }
            data[0].forEach((value) => {
                if (camelCase(value) == 'displayName' || camelCase(value) == 'createdAt' || camelCase(value) == 'lastLoginAt') {
                    const targetIndex = data[0].indexOf(value);
                    data[0][targetIndex] = snakeCase(value);
                }
            })
        }
        if (data[0].includes('id') && tableName == 'user') {
            const targetIndex = data[0].indexOf('id');
            data[0][targetIndex] = 'userKey';
        }
        tableSets.push({ name: tableName, columnSet: data[0], data: data.slice(1) });
    }
    return tableSets;
}

export function importData(transaction: AsyncTransaction, tableSets: object[]) {
    for (const tableSet of tableSets) {
        const tableName = tableSet['name'];
        const tableCols = tableSet['columnSet'];
        const rawData = tableSet['data'];
        //convert time string to date
        for (const dataRow of rawData) {
            for (let i = 0; i < dataRow.length; i++) {
                if (dataRow[i].includes('-') && dataRow[i].includes(':')) {
                    const timeString = dataRow[i];
                    const formattedTime = moment.utc(timeString, 'YYYY-MM-DD HH:mm:ss.SSSZ').format('YYYY-MM-DD HH:mm:ss.SSS[Z]');
                    dataRow[i] = formattedTime;
                }
            }
        }
        const rawSQL = `INSERT INTO ${DB_SCHEMA}.${tableName}({cols}) VALUES({vals});`;
        const cols = tableCols.join(',');
        for (const dataRow of rawData) {
            const dataImport = `'${dataRow.join('\', \'')}'`;
            const sql = rawSQL.replace('{cols}', cols).replace('{vals}', dataImport);
            transaction.sequelize.query(sql, {
                raw: true, type: 'INSERT', plain: false
            });
        }
    }
}