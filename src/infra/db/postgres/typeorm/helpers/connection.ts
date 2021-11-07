import { createConnection, QueryRunner, Connection, getConnectionManager, getConnection } from 'typeorm'
import { ConnectionNotFoundError } from './errors'

export class PgConnection {
  private static instance?: PgConnection
  private connection?: Connection

  private constructor() {}

  static getInstance (): PgConnection {
    if (PgConnection.instance === undefined) PgConnection.instance = new PgConnection()
    return PgConnection.instance
  }

  async connect(): Promise<void> {
    this.connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection()
  }

  async disconnect(): Promise<void> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()

    await getConnection().close()

    this.connection = undefined
  }
}

createConnection()
