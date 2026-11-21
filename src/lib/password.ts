// Password hashing with the Worker's built-in (native) scrypt from node:crypto.
//
// Why custom: Better Auth's default scrypt settings (N=16384, r=16, 32 MB) cost about
// 130 ms of CPU per sign-up/sign-in on Cloudflare, far over the Workers Free limit of
// 10 ms per request. These lighter settings cost about 4 MB of memory per hash.
// That's a deliberate trade-off for the free plan. It's weaker than OWASP's recommendation,
// so raise the settings when the app moves to Workers Paid.
//
// New hashes look like:  scrypt$N$r$p$<salt hex>$<key hex>
// The settings are saved inside each hash, so CURRENT can change later and old
// hashes still verify (and get upgraded on the next log-in, see needsRehash).
//
// Hashes made before this file existed use Better Auth's format: <salt hex>:<key hex>
// with N=16384, r=16, p=1. We still accept those (LEGACY below).
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

interface ScryptParams {
	N: number; // CPU/memory cost (a power of 2). Memory used = 128 * N * r bytes.
	r: number; // block size
	p: number; // parallelization
}

// Settings for new passwords. 128 * 4096 * 8 = 4 MB of memory per hash.
const CURRENT: ScryptParams = { N: 4096, r: 8, p: 1 };

// Better Auth's built-in settings, for passwords saved before this change.
const LEGACY: ScryptParams = { N: 16384, r: 16, p: 1 };

const KEY_BYTES = 64;
const SALT_BYTES = 16;

function deriveKey(password: string, salt: string, { N, r, p }: ScryptParams): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		// NFKC: treat visually identical Unicode characters the same (same as Better Auth).
		scrypt(password.normalize('NFKC'), salt, KEY_BYTES, { N, r, p, maxmem: 256 * N * r }, (err, key) =>
			err ? reject(err) : resolve(key),
		);
	});
}

interface ParsedHash {
	params: ScryptParams;
	salt: string;
	key: Buffer;
	legacy: boolean;
}

function parseHash(hash: string): ParsedHash | null {
	const parts = hash.split('$');
	if (parts.length === 6 && parts[0] === 'scrypt') {
		const [, N, r, p, salt, key] = parts;
		return { params: { N: Number(N), r: Number(r), p: Number(p) }, salt, key: Buffer.from(key, 'hex'), legacy: false };
	}
	const [salt, key] = hash.split(':');
	if (salt && key) {
		return { params: LEGACY, salt, key: Buffer.from(key, 'hex'), legacy: true };
	}
	return null;
}

export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(SALT_BYTES).toString('hex');
	const key = await deriveKey(password, salt, CURRENT);
	const { N, r, p } = CURRENT;
	return `scrypt$${N}$${r}$${p}$${salt}$${key.toString('hex')}`;
}

export async function verifyPassword({ hash, password }: { hash: string; password: string }): Promise<boolean> {
	const parsed = parseHash(hash);
	if (!parsed) return false;
	const key = await deriveKey(password, parsed.salt, parsed.params);
	// timingSafeEqual: compares without leaking (through timing) how many bytes matched.
	return key.length === parsed.key.length && timingSafeEqual(key, parsed.key);
}

// True if a hash was made with other settings than CURRENT (old format or old settings),
// so it should be re-hashed after a successful log-in.
export function needsRehash(hash: string): boolean {
	const parsed = parseHash(hash);
	if (!parsed) return false;
	const { N, r, p } = parsed.params;
	return parsed.legacy || N !== CURRENT.N || r !== CURRENT.r || p !== CURRENT.p;
}
