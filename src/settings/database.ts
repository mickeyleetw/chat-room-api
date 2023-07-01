import { Dialect, Options, Sequelize, Model, DataTypes, Transaction } from "sequelize";

export const DB_TYPE = process.env.DB_TYPE as Dialect || "postgres";
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = Number(process.env.DB_PORT) || 5432;
export const DB_USERNAME = process.env.DB_PASSWORD || "elk";
export const DB_PASSWORD = process.env.DB_PASSWORD || "password";
export const DB_NAME = process.env.DB_NAME || "elk";
export const DB_SCHEMA = process.env.DB_SCHEMA || "elk";
export const DB_LOGGING = Boolean(process.env.DB_LOGGING) || false;
export const DB_MAX_POOL_SIZE = Number(process.env.DB_MAX_POOL_SIZE) || 30;
export const DB_POOL_ACQUIRE_TIMEOUT = Number(process.env.DB_POOL_ACQUIRE_TIMEOUT) || 60000;
export const DB_POOL_IDLE_CONNECTION_TIME = Number(process.env.DB_POOL_IDLE_CONNECTION_TIME) || 30000;


// singleton class for Sequelize connection
export class SequelizeConnection {
  private static instance: Sequelize;

  static getInstance(): Sequelize {
    if (!SequelizeConnection.instance) {
      const dbConfig: Options = {
        dialect: DB_TYPE,
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME,
        schema: DB_SCHEMA,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        logging: DB_LOGGING,
        pool: {
          max: DB_MAX_POOL_SIZE,
          acquire: DB_POOL_ACQUIRE_TIMEOUT,
          idle: DB_POOL_IDLE_CONNECTION_TIME
        },
        dialectOptions: {
          sslmode: 'prefer'
        }
      };

      SequelizeConnection.instance = new Sequelize(dbConfig);
    }

    return SequelizeConnection.instance;
  }

  static async connect(): Promise<Sequelize> {
    const sequelize = SequelizeConnection.getInstance();
    try {
      await sequelize.authenticate();
      console.log("Database connection authenticated successfully");
      return sequelize;
    } catch (err) {
      console.log("Error while creation connection to database :: " + err.message);
      return sequelize;
    }
  }

  static async close(): Promise<Sequelize> {
    const sequelize = SequelizeConnection.getInstance();
    try {
      await sequelize.close();
      console.log("Database connection closed successfully");
      return sequelize;
    } catch (ex) {
      console.log("Error while closing database connection :: " + ex.message);
      return sequelize;
    }
  }

}


// Create Base column in all tables 
export class Base extends Model { }
Base.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }
  }, {
  sequelize: SequelizeConnection.getInstance(),
  schema: DB_SCHEMA,
  modelName: 'Base',
  freezeTableName: true,
  indexes: [
    {
      fields: ['createTime'],
      name: 'create_time_index',
    },
    {
      fields: ['updateTime'],
      name: 'update_time_index',
    },
  ],
}
)

// Create AsyncTransaction class for transaction management
export class AsyncTransaction {
  private transaction: Transaction | null = null;
  private sequelize: Sequelize= SequelizeConnection.getInstance();

  async start(): Promise<void> {
    this.transaction = await this.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        autocommit: false,
      }
    );
  }

  async commit(): Promise<void> {
    if (this.transaction) {
      await this.transaction.commit();
      this.transaction = null;
    }
  }

  async rollback(): Promise<void> {
    if (this.transaction) {
      await this.transaction.rollback();
      this.transaction = null;
    }
  }
}