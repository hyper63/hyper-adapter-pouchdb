import { assert } from './dev_deps.js'
import { PouchDbAdapterTypes } from './meta.js'

import factory from './mod.js'

Deno.test('should return db from load', async () => {
  const res = await factory({ storage: PouchDbAdapterTypes.memory }).load()

  assert(res.db)

  // teardown
  await res.db.down().toPromise()
})
