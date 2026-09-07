/**
 * Máscaras de exibição para campos de formulário.
 *
 * A máscara é sempre visual: o valor enviado ao backend deve ser normalizado
 * pelo schema de validação (valibot), que roda antes do submit. Ver o campo
 * de CPF em src/views/Login.jsx como referência.
 */

// Mantém apenas os dígitos de um valor, descartando pontuação da máscara.
export const onlyDigits = (value) => String(value ?? '').replace(/\D/g, '');

// Formata progressivamente como CPF: 000.000.000-00
export const maskCpf = (value) => {
    const digits = onlyDigits(value).slice(0, 11);

    return digits
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
};
