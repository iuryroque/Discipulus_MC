import { Event } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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

    return (
        <>
            <ProximoCultoCard culto={proximoCulto} onShow={onShow} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0, mb: 4 }}>
                <Card sx={{ flex: '300px' }}><CardContent sx={{ textAlign: 'center' }}><Typography variant="h4">{total}</Typography><Typography color="text.secondary">Total</Typography></CardContent></Card>
                <Card sx={{ flex: '300px', bgcolor: theme.palette.primary.main, color: 'white' }}><CardContent sx={{ textAlign: 'center' }}><Typography variant="h4" color="primary.contrastText">{agendados}</Typography><Typography color="primary.contrastText">Agendados</Typography></CardContent></Card>
                <Card sx={{ flex: '300px' }}><CardContent sx={{ textAlign: 'center' }}><Typography variant="h4">{realizados}</Typography><Typography color="text.secondary">Realizados</Typography></CardContent></Card>
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