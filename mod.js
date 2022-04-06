import adapter from "./adapter.js";
import PORT_NAME from "./port_name.js";

import { MetaDb, PouchDbAdapterTypes } from "./meta.js";

export { PouchDbAdapterTypes };

export default ({ storage } = {}) => ({
  id: "pouchdb",
  port: PORT_NAME,
  load: () => ({ db: MetaDb({ adapter: storage || PouchDbAdapterTypes.idb }) }), // load env
  link: (env) => (_) => adapter(env), // link adapter
});
