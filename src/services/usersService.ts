import * as crypto from 'crypto';

export const addEntry = () => null


export function extractUsername(email: string): string {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1) {
      return email.slice(0, atIndex);
    }
    return email;
  }

export function crypterPass(pass:string): string{
    const hash = crypto.createHash('sha256');
    hash.update(pass);
    return hash.digest('hex');
}