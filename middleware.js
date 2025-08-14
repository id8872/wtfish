import { NextResponse } from 'next/server';

// This function will run before every request to your site
export function middleware(request) {
  // Check if the MAINTENANCE_MODE environment variable is set to "true"
  if (process.env.MAINTENANCE_MODE === 'true') {
    
    // Get the path the user is trying to visit
    const pathname = request.nextUrl.pathname;

    // We need to allow access to the maintenance page itself and any assets (images, etc.)
    // Otherwise, the page would try to redirect itself in a loop.
    const isAllowedPath = pathname.startsWith('/oos.html') || pathname.startsWith('/assets/');

    // If the user is not trying to access an allowed path, redirect them
    if (!isAllowedPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/oos.html';
      return NextResponse.rewrite(url);
    }
  }

  // If maintenance mode is off, continue as normal.
  return NextResponse.next();
}

// This config specifies that the middleware should run on all paths
export const config = {
  matcher: '/:path*',
};
