// MUI Imports
import Grid from '@mui/material/Grid';

// Component Imports
import ClienteListTable from './ClienteListTable';
import ClienteListCards from './ClienteListCards';

const ClienteList = ({ userData }) => {
    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <ClienteListCards />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <ClienteListTable tableData={userData} />
            </Grid>
        </Grid>
    );
};

export default ClienteList;
