import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        frontend: 'healthy',
        api: await checkBackendAPI(),
        memory: checkMemory()
      }
    };

    // Prüfe ob alle Services gesund sind
    const allHealthy = Object.values(healthStatus.services).every(service => 
      typeof service === 'string' ? service === 'healthy' : service.status === 'healthy'
    );

    if (allHealthy) {
      return NextResponse.json(healthStatus, { status: 200 });
    } else {
      return NextResponse.json({
        ...healthStatus,
        status: 'unhealthy'
      }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
}

// Backend API Health Check
async function checkBackendAPI(): Promise<{status: string, details?: any}> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Timeout nach 5 Sekunden
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        status: 'healthy',
        details: {
          responseTime: '< 5s',
          backendStatus: data.status
        }
      };
    } else {
      return {
        status: 'unhealthy',
        details: {
          statusCode: response.status,
          statusText: response.statusText
        }
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: error instanceof Error ? error.message : 'Backend API unreachable'
      }
    };
  }
}

// Memory Health Check
function checkMemory(): {status: string, details: any} {
  const memUsage = process.memoryUsage();
  const totalMem = memUsage.heapTotal;
  const usedMem = memUsage.heapUsed;
  const memPercent = (usedMem / totalMem) * 100;

  return {
    status: memPercent < 90 ? 'healthy' : 'unhealthy',
    details: {
      heapUsed: `${Math.round(usedMem / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(totalMem / 1024 / 1024)}MB`,
      percentage: `${Math.round(memPercent)}%`
    }
  };
}
