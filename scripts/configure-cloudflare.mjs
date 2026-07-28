import { readFile, writeFile } from 'node:fs/promises';

const args = Object.fromEntries(process.argv.slice(2).map((item) => {
  const [key, ...rest] = item.replace(/^--/, '').split('=');
  return [key, rest.join('=')];
}));

const databaseId = String(args['database-id'] || '').trim();
const workerName = String(args.name || '').trim();

if (!/^[0-9a-f-]{30,40}$/i.test(databaseId)) {
  console.error('Missing or invalid --database-id. Example: node scripts/configure-cloudflare.mjs --database-id=YOUR_D1_ID --name=sarour-store-final-v10-cloudflar');
  process.exit(1);
}
if (workerName && !/^[a-z0-9-]{1,63}$/.test(workerName)) {
  console.error('Worker name may contain only lowercase letters, numbers and hyphens.');
  process.exit(1);
}

const path = new URL('../wrangler.toml', import.meta.url);
let text = await readFile(path, 'utf8');
text = text.replace(/database_id\s*=\s*"[^"]*"/, `database_id = "${databaseId}"`);
if (workerName) text = text.replace(/^name\s*=\s*"[^"]*"/m, `name = "${workerName}"`);
await writeFile(path, text);
console.log(`Configured wrangler.toml${workerName ? ` for ${workerName}` : ''} with D1 database ${databaseId}.`);
