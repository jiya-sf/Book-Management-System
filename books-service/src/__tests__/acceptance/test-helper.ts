import {BooksServiceApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import * as path from 'path';
import * as fs from 'fs';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new BooksServiceApplication({
    rest: restConfig,
  });
const testDbPath = path.join(__dirname, '../../../src/datasources/db.test.json');
  const testDbConfig = JSON.parse(fs.readFileSync(testDbPath, 'utf-8'));

  app.bind('datasources.config.db').to(testDbConfig);

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: BooksServiceApplication;
  client: Client;
}
