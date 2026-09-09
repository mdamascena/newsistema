// MUI Imports
import Grid from '@mui/material/Grid';

// Component Imports
import CredLuzListTable from '@views/apps/emprestimos/produtos/credluz/CredLuzListTable';
import CredLuzCard from '@views/apps/emprestimos/produtos/credluz/CredLuzCard';

// Data Imports
import { getEcommerceData } from '@/app/server/actions';

const CredLuzPage = async () => {
    // Vars
    const data = await getEcommerceData();

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <CredLuzCard />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <CredLuzListTable productData={data?.products} />
            </Grid>
        </Grid>
    );
};

export default CredLuzPage;
