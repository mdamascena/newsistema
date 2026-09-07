// Component Imports
import Register from '@views/Register';

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers';

export const metadata = {
    title: 'Criar conta',
    description: 'Crie sua conta de acesso'
};

const RegisterPage = async () => {
    // Vars
    const mode = await getServerMode();

    return <Register mode={mode} />;
};

export default RegisterPage;
