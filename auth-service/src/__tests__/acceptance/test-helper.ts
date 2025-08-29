import {Lb4Application} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

export async function setupApplication(options?: { useMemoryDb?: boolean }): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new Lb4Application({
    rest: restConfig,
  });
if (options?.useMemoryDb) {
    // Use in-memory DB
    app.bind('datasources.config.db').to({
      name: 'db',
      connector: 'memory',
    });
  } else {
    // Use real DB (MySQL/Postgres/etc.)
    app.bind('datasources.config.db').to({
      name: 'db',
      connector: 'mysql', // or 'postgresql', etc.
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'testdb',
    });
  }

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: Lb4Application;
  client: Client;
}