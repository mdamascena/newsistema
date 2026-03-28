// Next Imports
import { headers } from 'next/headers';

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css';

// Component Imports

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper';

// Config Imports
import { i18n } from '@configs/i18n';

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers';

// Style Imports
import '@/app/globals.css';

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css';

export const metadata = {
    title: 'Portal Valoreal',
    description: '',
    icons: {
        icon: '/images/icons/favicon.png?v=2',
        shortcut: '/images/icons/favicon.png?v=2',
        apple: '/images/icons/favicon.png?v=2'
    }
};

const RootLayout = async (props) => {
    const params = await props.params;
    const { children } = props;

    // Type guard to ensure lang is a valid Locale
    const lang = i18n.locales.includes(params.lang) ? params.lang : i18n.defaultLocale;

    // Vars
    const headersList = await headers();
    const systemMode = await getSystemMode();
    const direction = i18n.langDirection[lang];

    return (
        <TranslationWrapper headersList={headersList} lang={lang}>
            <html id="__next" lang={lang} dir={direction} suppressHydrationWarning>
                <head>
                    <link rel="icon" href="/images/icons/favicon.png?v=3" type="image/png" />
                    <link rel="shortcut icon" href="/images/icons/favicon.png?v=3" type="image/png" />
                    <link rel="apple-touch-icon" href="/images/icons/favicon.png?v=3" />
                </head>
                <body className="flex is-full min-bs-full flex-auto flex-col" suppressHydrationWarning>
                    <InitColorSchemeScript attribute="data" defaultMode={systemMode} />
                    {children}
                </body>
            </html>
        </TranslationWrapper>
    );
};

export default RootLayout;
