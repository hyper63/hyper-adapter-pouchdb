import { default as hyper } from 'https://raw.githubusercontent.com/hyper63/hyper/hyper%40v4.1.0/packages/core/mod.ts'
import { default as app } from 'https://raw.githubusercontent.com/hyper63/hyper/hyper-app-express%40v1.1.0/packages/app-express/mod.ts'

import myAdapter from '../mod.js'
import PORT_NAME from '../port_name.js'

const hyperConfig = {
  app,
  adapters: [
    {
      port: PORT_NAME,
      plugins: [myAdapter({ dir: './test' })],
    },
  ],
}

hyper(hyperConfig)
