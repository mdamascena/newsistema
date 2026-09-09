// Component Imports
import FuncionarioList from '@views/apps/usuarios/funcionario';

// Data Imports
import { getUserData } from '@/app/server/actions';

const FuncionarioListApp = async () => {
    // Vars
    const data = await getUserData();

    return <FuncionarioList userData={data} />;
};

export default FuncionarioListApp;
