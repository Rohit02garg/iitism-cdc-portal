import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      role: 'company' | 'admin';
      accessToken: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'company' | 'admin';
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: 'company' | 'admin';
    accessToken: string;
  }
}
