import client from './client.js';
import { rebuildDB } from './seedData.js';

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());