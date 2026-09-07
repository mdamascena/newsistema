// Next Imports
import { NextResponse } from 'next/server';

/*
 * Proxy para POST {AUTH_API_URL}/auth/register.
 *
 * Fica no servidor para que a URL do backend não precise ser exposta ao
 * navegador (AUTH_API_URL não tem prefixo NEXT_PUBLIC_) e para não depender
 * da política de CORS da Auth.Api.
 *
 * A Auth.Api aceita apenas Cpf e Password, e responde com token — mas quem
 * cria a sessão é o NextAuth, no signIn que a tela dispara em seguida.
 */
const fail = (messages, status) => NextResponse.json({ message: messages }, { status });

export async function POST(req) {
    let body;

    try {
        body = await req.json();
    } catch {
        return fail(['Requisição inválida'], 400);
    }

    const cpf = String(body?.cpf ?? '').replace(/\D/g, '');
    const password = String(body?.password ?? '');

    if (cpf.length !== 11 || !password) {
        return fail(['Informe um CPF válido e uma senha'], 400);
    }

    let res;

    try {
        res = await fetch(`${process.env.AUTH_API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, password }),

            // Sem timeout a requisição pendura: uma porta fechada aqui não é
            // recusada de imediato, o pacote é descartado em silêncio.
            signal: AbortSignal.timeout(10000)
        });
    } catch {
        return fail(['Não foi possível conectar ao servidor de autenticação'], 502);
    }

    if (res.ok) {
        return NextResponse.json({ ok: true });
    }

    if (res.status === 400) {
        const detail = await res.text();

        return fail([detail?.trim() || 'Não foi possível criar o usuário'], 400);
    }

    /*
     * O CPF tem índice único no banco (usuarios_us_cpf_unique) e a Auth.Api
     * não trata a exceção, então cadastro duplicado chega aqui como 500.
     * A mensagem cobre esse caso sem afirmar que foi ele.
     */
    if (res.status === 500) {
        return fail(['Não foi possível concluir o cadastro. Se este CPF já possui conta, use a tela de login.'], 409);
    }

    return fail([`Erro inesperado no cadastro (HTTP ${res.status})`], res.status);
}
