import { createAudit } from './audit';
import { cleanupCollection } from './cleanup';
import { createUserActivity } from './user-activity';

async function main() {
  cleanupCollection();
  createAudit();
  createUserActivity();
}

main();
