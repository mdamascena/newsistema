// MUI Imports
import Grid from '@mui/material/Grid';

// Component Imports
import GeralListTable from '@views/apps/emprestimos/produtos/geral/GeralListTable';
import GeralCard from '@views/apps/emprestimos/produtos/geral/GeralCard';

// Data Imports
import { getEcommerceData } from '@/app/server/actions';

const GeralPage = async () => {
    // Vars
    const data = await getEcommerceData();

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <GeralCard />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <GeralListTable productData={data?.products} />
            </Grid>
        </Grid>
    );
};

export default GeralPage;
