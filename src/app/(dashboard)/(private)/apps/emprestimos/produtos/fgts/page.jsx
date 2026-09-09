// MUI Imports
import Grid from '@mui/material/Grid';

// Component Imports
import FgtsListTable from '@views/apps/emprestimos/produtos/fgts/FgtsListTable';
import FgtsCard from '@views/apps/emprestimos/produtos/fgts/FgtsCard';

// Data Imports
import { getEcommerceData } from '@/app/server/actions';

const FgtsPage = async () => {
    // Vars
    const data = await getEcommerceData();

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <FgtsCard />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <FgtsListTable productData={data?.products} />
            </Grid>
        </Grid>
    );
};

export default FgtsPage;
