import { auth } from '@/server/auth';

export default async function middleware(...args: Parameters<typeof auth>) {
  return auth(...args);
}

export const config = {
  matcher: [
    '/((?!api/auth|assets|_next/static|_next/image|static|favicon.ico|auth).*)',
  ],
};