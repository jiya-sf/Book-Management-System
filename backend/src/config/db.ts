import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
///singleton pattern - only 1 instance of db
class Database{
  private static instance: Sequelize;
  private constructor(){}
  public static getInstance(): Sequelize{
    if(!Database.instance){
      Database.instance=new Sequelize(
          process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql'
      }
    );
    }
    return Database.instance;
  }
}
export const sequelize= Database.getInstance();





// export const sequelize = new Sequelize(
//   process.env.DB_NAME as string,
//   process.env.DB_USER as string,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql'
//     }
// );
