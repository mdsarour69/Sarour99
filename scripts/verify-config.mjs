import { readFile } from 'node:fs/promises';

const path = new URL('../wrangler.toml', import.meta.url);
const text = await readFile(path, 'utf8');
const problems = [];
if (text.includes('REPLACE_WITH_YOUR_D1_DATABASE_ID')) problems.push('D1 database_id is still a placeholder.');
if (!/\[\[d1_databases\]\][\s\S]*binding\s*=\s*"DB"/.test(text)) problems.push('D1 binding DB is missing.');
if (!/\[assets\][\s\S]*binding\s*=\s*"ASSETS"/.test(text)) problems.push('ASSETS binding is missing.');
if (problems.length) {
  console.error('Cloudflare configuration is incomplete:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log('Cloudflare configuration check passed.');
