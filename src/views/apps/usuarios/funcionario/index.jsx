// MUI Imports
import Grid from '@mui/material/Grid';

// Component Imports
import FuncionarioListTable from './FuncionarioListTable';
import FuncionarioListCards from './FuncionarioListCards';

const FuncionarioList = ({ userData }) => {
    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <FuncionarioListCards />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <FuncionarioListTable tableData={userData} />
            </Grid>
        </Grid>
    );
};

export default FuncionarioList;
