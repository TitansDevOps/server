/**
 * Script para ejecutar scripts SQL en la base de datos anets de un npm start.
 * Se leen los scripts desde un archivo de configuración YAML.
 * Maicol Alvarez el papá de todos ustedes.
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

dotenv.config();

const client = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl:
    process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

async function executeSQL() {
  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    const configPath = path.join(__dirname, 'config.yaml');
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(configFile);
    const sqlScripts: string[] = config.sql_scripts || [];

    for (let query of sqlScripts) {
      query = query
        .replace('{{PETS_OWNER_USER}}', process.env.DB_USERNAME!)
        .replace('{{PETS_OWNER_PASSWORD}}', process.env.DB_PASSWORD!)
        .replace('{{DB_NAME}}', process.env.DB_NAME!);

      console.log(`📝 Ejecutando: ${query}`);
      await client.query(query);
    }

    console.log('✅ Scripts SQL ejecutados correctamente');
  } catch (error) {
    console.error('❌ Error ejecutando los scripts SQL:', error);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

executeSQL();
