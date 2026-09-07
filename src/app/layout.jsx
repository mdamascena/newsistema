// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css';

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
    const { children } = props;

    // Vars
    const systemMode = await getSystemMode();
    const direction = 'ltr';

    return (
        <html id="__next" lang="en" dir={direction} suppressHydrationWarning>
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
    );
};

export default RootLayout;
