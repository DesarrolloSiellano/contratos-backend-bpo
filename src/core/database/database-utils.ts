import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

export async function ensureDatabaseExists() {
  // Intentar cargar .env desde la raíz del proyecto si no se ha cargado
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }

  const host = process.env.DB_HOST_PS || process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT_PS || process.env.DB_PORT || '5432', 10);
  const user = process.env.DB_USERNAME_PS || process.env.DB_USERNAME || 'postgres';
  const password = process.env.DB_PASSWORD_PS || process.env.DB_PASSWORD || '';
  const databaseName = process.env.DB_NAME_PS || process.env.DB_NAME || 'contratos_db';

  console.log(`[DatabaseUtils] Configuración detectada: host=${host}, user=${user}, database=${databaseName}`);

  const client = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres', // Siempre conectar a 'postgres' para operaciones administrativas
  });

  try {
    await client.connect();
    console.log(`[DatabaseUtils] Conectado a PostgreSQL en ${host} para verificación.`);

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [databaseName],
    );

    if (res.rowCount === 0) {
      console.log(`[DatabaseUtils] La base de datos "${databaseName}" no existe. Intentando crear...`);
      // Nota: CREATE DATABASE no puede ser parametrizado con $1 en TypeORM/pg de esta forma tan directa
      // pero como el nombre viene de una fuente controlada (env), usamos template strings.
      await client.query(`CREATE DATABASE "${databaseName}"`);
      console.log(`[DatabaseUtils] Base de datos "${databaseName}" creada exitosamente.`);
    } else {
      console.log(`[DatabaseUtils] La base de datos "${databaseName}" ya existe.`);
    }
  } catch (error) {
    console.error('[DatabaseUtils] Error crítico durante la verificación/creación:', error.message);
  } finally {
    try {
      await client.end();
    } catch (e) {
      // Ignorar error al cerrar conexión
    }
  }
}
