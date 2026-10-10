/**
 * Asset URL Resolver
 * 
 * Handles normalization and routing of asset URLs:
 * - Direct absolute URLs (http://, https://, data:, blob:) are returned as-is.
 * - Backend uploaded media (/uploads/...) is prepended with the backend base URL.
 * - Packaged frontend static assets (/images/..., /audio/...) are returned as-is.
 */
export function resolveAssetUrl(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Already an absolute URL, data URI, or blob URL
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  // Uploaded media managed by backend Express server
  if (url.startsWith('/uploads/')) {
    let backendUrl = 'http://localhost:3000';
    try {
      if (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_BACKEND_URL) {
        backendUrl = import.meta.env.VITE_BACKEND_URL;
      } else if (typeof process !== 'undefined' && process?.env?.VITE_BACKEND_URL) {
        backendUrl = process.env.VITE_BACKEND_URL;
      }
    } catch {
      // Fallback to default
    }
    return `${backendUrl.replace(/\/+$/, '')}${url}`;
  }

  // Local static assets from frontend public directory
  return url;
}
