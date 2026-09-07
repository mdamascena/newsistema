// Component Imports
import Login from '@views/Login';

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers';

export const metadata = {
    title: 'Entrar',
    description: 'Acesse sua conta'
};

const LoginPage = async () => {
    // Vars
    const mode = await getServerMode();

    return <Login mode={mode} />;
};

export default LoginPage;
