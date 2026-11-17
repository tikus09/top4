// Used ONLY by the Better Auth CLI (`npm run auth:generate`) to know which
// tables Better Auth needs. The app itself uses src/lib/auth.ts.
import { betterAuth } from 'better-auth';
import { authOptions } from './src/lib/auth-options';

export const auth = betterAuth(authOptions);
