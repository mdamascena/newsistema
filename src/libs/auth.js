// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const hasGoogleProvider = Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim());

// Chave longa que o .NET usa quando ClaimTypes.Role não é mapeado para o nome curto
const MS_ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

/*
 * Lê o payload do JWT emitido pela Valoreal.Auth.Api.
 * Não valida a assinatura de propósito: a validação é responsabilidade do
 * backend, que confere o token a cada requisição. Aqui os dados servem apenas
 * para popular a sessão (nome, papel), nunca para autorizar uma ação.
 */
const readTokenPayload = (accessToken) => {
    try {
        const payload = accessToken.split('.')[1];

        if (!payload) return {};

        return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    } catch {
        return {};
    }
};

const authError = (...messages) => new Error(JSON.stringify({ message: messages }));

const providers = [
    CredentialProvider({
        name: 'Credentials',
        type: 'credentials',
        credentials: {},
        async authorize(credentials) {
            const { cpf, password } = credentials;

            let res;

            try {
                res = await fetch(`${process.env.AUTH_API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cpf, password }),

                    // Ver comentário em src/app/api/register/route.js
                    signal: AbortSignal.timeout(10000)
                });
            } catch {
                throw authError('Não foi possível conectar ao servidor de autenticação');
            }

            if (res.status === 401) {
                throw authError('CPF ou senha inválidos');
            }

            if (!res.ok) {
                throw authError(`Erro inesperado na autenticação (HTTP ${res.status})`);
            }

            const { accessToken, refreshToken } = await res.json();

            if (!accessToken) {
                throw authError('O servidor de autenticação não retornou um token');
            }

            const payload = readTokenPayload(accessToken);

            /*
             * O expiresIn devolvido pela API não é usado: hoje ele informa 3600,
             * mas o token é gerado com 30 minutos de validade. O `exp` do próprio
             * JWT é a fonte confiável.
             */
            return {
                id: payload.sub ?? null,
                name: payload.cpf ?? cpf,
                cpf: payload.cpf ?? cpf,
                role: payload.role ?? payload[MS_ROLE_CLAIM] ?? null,
                accessToken,
                refreshToken: refreshToken ?? null,
                accessTokenExpiresAt: payload.exp ? payload.exp * 1000 : null
            };
        }
    })
];

if (hasGoogleProvider) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    );
}

export const authOptions = {
    providers,

    session: {
        strategy: 'jwt',

        /*
         * Alinhado ao tempo de vida real do token da Auth.Api (30 minutos).
         * Sem renovação implementada, uma sessão mais longa que o token faria o
         * usuário parecer logado enquanto toda chamada ao backend responde 401.
         */
        maxAge: 30 * 60
    },

    pages: {
        signIn: '/login'
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.cpf = user.cpf;
                token.role = user.role;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpiresAt = user.accessTokenExpiresAt;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.cpf = token.cpf;
                session.user.role = token.role;
            }

            // Token repassado ao client para chamar a Loans.Api
            session.accessToken = token.accessToken;
            session.accessTokenExpiresAt = token.accessTokenExpiresAt;

            return session;
        }
    }
};
