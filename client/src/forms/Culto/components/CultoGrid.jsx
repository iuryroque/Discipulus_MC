import { CheckCircle, Event, Schedule } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useListContext } from 'react-admin';
import { CultoCard } from './CultoCard';
import { ProximoCultoCard } from './ProximoCultoCard';

export const CultoGrid = ({ onEdit, onShow, onDelete }) => {
    const { data: cultos, total, isLoading, error } = useListContext();
    const theme = useTheme();

    if (isLoading) {
        return <Grid container spacing={3}>{Array.from(new Array(6)).map((_, i) => <Grid item xs={12} md={4} key={i}><Skeleton variant="rectangular" height={280} /></Grid>)}</Grid>;
    }
    if (error) return <Typography color="error">Erro ao carregar os cultos.</Typography>;
    if (!cultos) return null;

    const now = new Date();
    const proximoCulto = cultos
        .filter(c => c.status?.toLowerCase() === 'agendado' && new Date(c.dataHora) > now)
        .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))[0];

    const agendados = cultos.filter(c => c.status?.toLowerCase() === 'agendado').length;
    const realizados = cultos.filter(c => c.status?.toLowerCase() === 'realizado').length;

    const TotalIcon = <Event sx={{ fontSize: 32, color: theme.palette.primary.main }} />;
    const AgendadosIcon = <Schedule sx={{ fontSize: 32, color: theme.palette.common.white }} />;
    const RealizadosIcon = <CheckCircle sx={{ fontSize: 32, color: theme.palette.primary.main }} />;

    return (
        <>
            <ProximoCultoCard culto={proximoCulto} onShow={onShow} />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Card sx={{ minWidth: 220, flex: 1 }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography color="text.secondary">Total</Typography>
                            <Typography variant="h4">{total}</Typography>
                        </Box>
                        {TotalIcon}
                    </CardContent>
                </Card>

                <Card sx={{ minWidth: 220, flex: 1, bgcolor: theme.palette.primary.main, color: '#fff' }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography sx={{ color: '#fff' }}>Agendados</Typography>
                            <Typography variant="h4" sx={{ color: '#fff' }}>{agendados}</Typography>
                        </Box>
                        {AgendadosIcon}
                    </CardContent>
                </Card>

                <Card sx={{ minWidth: 220, flex: 1 }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography color="text.secondary">Realizados</Typography>
                            <Typography variant="h4">{realizados}</Typography>
                        </Box>
                        {RealizadosIcon}
                    </CardContent>
                </Card>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Todos os Cultos</Typography>

            {cultos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Event sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">Nenhum culto encontrado</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {cultos.map((culto) => (
                        <Grid item xs={12} sm={6} md={4} key={culto.id}>
                            <CultoCard record={culto} onEdit={onEdit} onDelete={onDelete} onShow={onShow} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
};

CultoGrid.propTypes = {
    onEdit: PropTypes.func,
    onShow: PropTypes.func,
    onDelete: PropTypes.func,
};