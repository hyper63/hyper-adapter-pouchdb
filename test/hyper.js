import { default as appOpine } from 'https://x.nest.land/hyper-app-opine@2.1.0/mod.js'
import { default as core } from 'https://x.nest.land/hyper@3.2.2/mod.js'

import myAdapter from '../mod.js'
import PORT_NAME from '../port_name.js'

const hyperConfig = {
  app: appOpine,
  adapters: [
    {
      port: PORT_NAME,
      plugins: [myAdapter({ dir: './test' })],
    },
  ],
}

core(hyperConfig)
