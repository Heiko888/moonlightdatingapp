import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'BUILD-UNKNOWN',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        frontend: 'nextjs',
        database: 'supabase',
        api: 'express'
      }
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'BUILD-UNKNOWN',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
