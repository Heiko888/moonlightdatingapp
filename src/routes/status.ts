// src/routes/status.ts
import type { Request, Response } from 'express';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

// Falls du OpenAI nutzt:
import OpenAI from 'openai';

// Optional: deine Models für Zählwerte
import KnowledgeItem from '../models/KnowledgeItem';
import Reading from '../models/Reading';
import Chart from '../models/Chart';

const router = express.Router();

// --- Helpers -----------------------------------------------------

async function checkMongo() {
  try {
    // Verbindung / Ping
    const state = mongoose.connection.readyState; // 1=connected, 2=connecting
    const ok = state === 1;
    let ping = false;
    try {
      // Ping nur versuchen, wenn connected
      if (ok && mongoose.connection.db) {
        ping = !!(await mongoose.connection.db.command({ ping: 1 }));
      }
    } catch { /* ignore */ }

    return {
      ok: ok && ping,
      readyState: state,
      dbName: mongoose.connection.db?.databaseName ?? null,
      host: (mongoose.connection as any)?.host ?? null
    };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'mongo error' };
  }
}

async function checkFilesystem() {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const testFile = path.join(uploadsDir, '.healthcheck.tmp');
    await fs.writeFile(testFile, 'ok');
    await fs.rm(testFile);
    return { ok: true, uploadsDir };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'fs error' };
  }
}

async function checkOpenAI() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  if (!hasKey) return { ok: false, error: 'OPENAI_API_KEY fehlt' };

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // sehr leichter Call: Modell-Liste (kurz timeouten)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    // Hinweis: Du kannst auch einen „responses.create“ Minimalaufruf testen.
    await client.models.list({ signal: controller.signal });

    clearTimeout(timeout);
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'openai error' };
  }
}

async function checkCounts() {
  try {
    const [knowledge, readings, charts] = await Promise.all([
      KnowledgeItem.countDocuments({}).catch(() => 0),
      Reading.countDocuments({}).catch(() => 0),
      Chart.countDocuments({}).catch(() => 0),
    ]);
    return { ok: true, knowledge, readings, charts };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'count error' };
  }
}

// --- Route -------------------------------------------------------

router.get('/status', async (_req: Request, res: Response) => {
  const startedAt = Date.now();

  const [mongo, fsHealth, openai, counts] = await Promise.all([
    checkMongo(),
    checkFilesystem(),
    checkOpenAI(),
    checkCounts(),
  ]);

  const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || '4000',
    MONGODB_URI: process.env.MONGODB_URI ? 'set' : 'missing',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'set' : 'missing',
  };

  const healthy = !!(mongo.ok && fsHealth.ok && openai.ok);

  res.status(healthy ? 200 : 503).json({
    ok: healthy,
    timestamp: new Date().toISOString(),
    uptimeSec: process.uptime(),
    tookMs: Date.now() - startedAt,
    services: {
      mongo,
      filesystem: fsHealth,
      openai,
    },
    counts,
    env,
    version: {
      app: process.env.APP_VERSION || '0.1.0',
      build: process.env.BUILD_ID || null,
    },
  });
});

export default router;
