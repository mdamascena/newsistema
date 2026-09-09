// Component Imports
import ClienteList from '@views/apps/usuarios/cliente';

// Data Imports
import { getUserData } from '@/app/server/actions';

const ClienteListApp = async () => {
    // Vars
    const data = await getUserData();

    return <ClienteList userData={data} />;
};

export default ClienteListApp;
