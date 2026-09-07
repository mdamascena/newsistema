'use client';

// React Imports
import { useState } from 'react';

// Next Imports
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

// Third-party Imports
import { signIn } from 'next-auth/react';
import { Controller, useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { object, string, boolean, pipe, nonEmpty, minLength, regex, transform, check, forward } from 'valibot';
import classnames from 'classnames';

// Component Imports
import Logo from '@components/layout/shared/Logo';
import CustomTextField from '@core/components/mui/TextField';

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant';
import { useSettings } from '@core/hooks/useSettings';

// Util Imports
import { maskCpf } from '@/utils/masks';

// Styled Custom Components
const RegisterIllustration = styled('img')(({ theme }) => ({
    zIndex: 2,
    blockSize: 'auto',
    maxBlockSize: 600,
    maxInlineSize: '100%',
    margin: theme.spacing(12),
    [theme.breakpoints.down(1536)]: {
        maxBlockSize: 550
    },
    [theme.breakpoints.down('lg')]: {
        maxBlockSize: 450
    }
}));

const MaskImg = styled('img')({
    blockSize: 'auto',
    maxBlockSize: 345,
    inlineSize: '100%',
    position: 'absolute',
    insetBlockEnd: 0,
    zIndex: -1
});

/*
 * A Auth.Api aceita apenas Cpf e Password. A confirmação de senha e o aceite
 * dos termos são validados apenas aqui e não vão no payload.
 */
const schema = pipe(
    object({
        cpf: pipe(
            string(),
            nonEmpty('Informe o CPF'),
            transform((value) => value.replace(/\D/g, '')),
            regex(/^\d{11}$/, 'O CPF deve ter 11 dígitos')
        ),
        password: pipe(string(), nonEmpty('Informe a senha'), minLength(5, 'A senha deve ter ao menos 5 caracteres')),
        confirmPassword: pipe(string(), nonEmpty('Confirme a senha')),
        terms: pipe(
            boolean(),
            check((value) => value === true, 'É necessário aceitar os termos')
        )
    }),
    forward(
        check((input) => input.password === input.confirmPassword, 'As senhas não conferem'),
        ['confirmPassword']
    )
);

const Register = ({ mode }) => {
    // States
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [errorState, setErrorState] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Vars
    const darkImg = '/images/pages/auth-mask-dark.png';
    const lightImg = '/images/pages/auth-mask-light.png';
    const darkIllustration = '/images/illustrations/auth/v2-register-dark.png';
    const lightIllustration = '/images/illustrations/auth/v2-register-light.png';
    const borderedDarkIllustration = '/images/illustrations/auth/v2-register-dark-border.png';
    const borderedLightIllustration = '/images/illustrations/auth/v2-register-light-border.png';

    // Hooks
    const router = useRouter();
    const { settings } = useSettings();
    const theme = useTheme();
    const hidden = useMediaQuery(theme.breakpoints.down('md'));
    const authBackground = useImageVariant(mode, lightImg, darkImg);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: valibotResolver(schema),
        defaultValues: {
            cpf: '',
            password: '',
            confirmPassword: '',
            terms: false
        }
    });

    const characterIllustration = useImageVariant(
        mode,
        lightIllustration,
        darkIllustration,
        borderedLightIllustration,
        borderedDarkIllustration
    );

    const handleClickShowPassword = () => setIsPasswordShown((show) => !show);

    const onSubmit = async (data) => {
        setErrorState(null);
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf: data.cpf, password: data.password })
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);

                setErrorState(body?.message?.[0] ?? 'Não foi possível concluir o cadastro');

                return;
            }

            // Conta criada: autentica em seguida para abrir a sessão do NextAuth
            const signInRes = await signIn('credentials', {
                cpf: data.cpf,
                password: data.password,
                redirect: false
            });

            if (signInRes?.ok) {
                router.replace('/');
            } else {
                setErrorState('Conta criada, mas não foi possível entrar. Use a tela de login.');
            }
        } catch {
            setErrorState('Não foi possível concluir o cadastro');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex bs-full justify-center">
            <div
                className={classnames(
                    'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
                    {
                        'border-ie': settings.skin === 'bordered'
                    }
                )}
            >
                <RegisterIllustration src={characterIllustration} alt="character-illustration" />
                {!hidden && <MaskImg alt="mask" src={authBackground} />}
            </div>
            <div className="flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]">
                <Link
                    href={'/login'}
                    className="absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]"
                >
                    <Logo />
                </Link>
                <div className="flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0">
                    <div className="flex flex-col gap-1">
                        <Typography variant="h4">Criar uma conta 🚀</Typography>
                        <Typography>Informe seu CPF e defina uma senha de acesso</Typography>
                    </div>
                    {errorState && <Alert severity="error">{errorState}</Alert>}
                    <form
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-6"
                    >
                        <Controller
                            name="cpf"
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    autoFocus
                                    fullWidth
                                    type="text"
                                    label="CPF"
                                    placeholder="000.000.000-00"
                                    slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 14 } }}
                                    onChange={(e) => {
                                        field.onChange(maskCpf(e.target.value));
                                        setErrorState(null);
                                    }}
                                    {...(errors.cpf && { error: true, helperText: errors.cpf.message })}
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    label="Senha"
                                    placeholder="············"
                                    type={isPasswordShown ? 'text' : 'password'}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setErrorState(null);
                                    }}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        edge="end"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                    >
                                                        <i
                                                            className={
                                                                isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'
                                                            }
                                                        />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }
                                    }}
                                    {...(errors.password && { error: true, helperText: errors.password.message })}
                                />
                            )}
                        />
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    label="Confirmar senha"
                                    placeholder="············"
                                    type={isPasswordShown ? 'text' : 'password'}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setErrorState(null);
                                    }}
                                    {...(errors.confirmPassword && {
                                        error: true,
                                        helperText: errors.confirmPassword.message
                                    })}
                                />
                            )}
                        />
                        <div>
                            <Controller
                                name="terms"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} checked={field.value} />}
                                        label={
                                            <>
                                                <span>Li e aceito a </span>
                                                <Link
                                                    className="text-primary"
                                                    href="/"
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    política de privacidade e os termos de uso
                                                </Link>
                                            </>
                                        }
                                    />
                                )}
                            />
                            {errors.terms && <FormHelperText error>{errors.terms.message}</FormHelperText>}
                        </div>
                        <Button fullWidth variant="contained" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
                        </Button>
                        <div className="flex justify-center items-center flex-wrap gap-2">
                            <Typography>Já tem uma conta?</Typography>
                            <Typography component={Link} href={'/login'} color="primary.main">
                                Entrar
                            </Typography>
                        </div>
                        <Divider className="gap-2">ou</Divider>
                        <div className="flex justify-center items-center gap-1.5">
                            <IconButton className="text-facebook" size="small">
                                <i className="tabler-brand-facebook-filled" />
                            </IconButton>
                            <IconButton className="text-twitter" size="small">
                                <i className="tabler-brand-twitter-filled" />
                            </IconButton>
                            <IconButton className="text-textPrimary" size="small">
                                <i className="tabler-brand-github-filled" />
                            </IconButton>
                            <IconButton className="text-error" size="small">
                                <i className="tabler-brand-google-filled" />
                            </IconButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
