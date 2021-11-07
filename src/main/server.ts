import env from './config/env'
import { PgConnection } from '../infra/db/postgres/typeorm/helpers'

import 'reflect-metadata'

PgConnection.getInstance().connect()
  .then(async () => {
    const app = await (await import('../main/config/app')).default
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  })
  .catch(console.error)
