import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Create PrismaClient - it will work during build even without DATABASE_URL
// The client will only fail when actually trying to connect to the database
// For Supabase, use the connection pooler URL (format: postgresql://...?pgbouncer=true)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Checks if a Prisma error is a connection/database error
 */
export function isDatabaseConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P1000: Authentication failed
    // P1001: Can't reach database server
    // P1002: Database connection timeout
    // P1003: Database does not exist
    // P1008: Operations timed out
    // P1009: Database already exists (connection issue)
    // P1010: User was denied access
    // P1011: Error opening a TLS connection
    // P1017: Server has closed the connection
    return [
      'P1000', 'P1001', 'P1002', 'P1003', 'P1008', 'P1009', 'P1010', 'P1011', 'P1017'
    ].includes(error.code);
  }
  
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }
  
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return true;
  }
  
  // Check for common connection error messages
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('can\'t reach database server') ||
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('authentication failed') ||
      message.includes('database') ||
      message.includes('prisma client')
    );
  }
  
  return false;
}

/**
 * Checks if the database is available by attempting a simple query
 */
export async function checkDatabaseHealth(): Promise<{ available: boolean; error?: string }> {
  try {
    // Try a simple query that doesn't require any tables
    await prisma.$queryRaw`SELECT 1`;
    return { available: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (isDatabaseConnectionError(error)) {
      return {
        available: false,
        error: `Database connection error: ${errorMessage}`
      };
    }
    
    return {
      available: false,
      error: `Database error: ${errorMessage}`
    };
  }
}

/**
 * Safely executes a Prisma operation with error handling
 */
export async function safePrismaOperation<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (isDatabaseConnectionError(error)) {
      console.error('Database connection error:', errorMessage);
      return {
        success: false,
        error: 'Database connection unavailable',
        data: fallback
      };
    }
    
    console.error('Prisma operation error:', errorMessage);
    return {
      success: false,
      error: errorMessage,
      data: fallback
    };
  }
}

export default prisma;


