import { Group, Person, Warning } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useListContext } from 'react-admin';
import { PessoaCard } from './PessoaCard';

// Este componente renderiza as estatísticas e a grade de cards.
export const PessoaCardGrid = ({ onEdit, onShow, onDelete }) => {
    const { data: pessoas, total, isLoading, error } = useListContext();
    const theme = useTheme();

    if (isLoading) {
        return (
            <Grid container spacing={3}>
                {Array.from(new Array(6)).map((_, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Warning sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                <Typography variant="h6" color="error.main">Erro ao carregar visitantes</Typography>
            </Box>
        );
    }

    if (!pessoas || pessoas.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">Nenhum visitante encontrado</Typography>
            </Box>
        );
    }
    
    const visitantesAtivos = pessoas.filter(p => p.status === 'ATIVO').length;
    const visitantesInativos = total - visitantesAtivos;
    const TotalIcon = <Group sx={{ fontSize: 32, color: theme.palette.primary.main }} />;
    const AtivosIcon = <Group sx={{ fontSize: 32, color: '#fff' }} />;
    const InativosIcon = <Group sx={{ fontSize: 32, color: theme.palette.text.disabled }} />;

    return (
        <>
            {/* Estatísticas */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Card sx={{ minWidth: 220, flex: 1 }}><CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography color="text.secondary">Total</Typography><Typography variant="h4">{total}</Typography></Box>{TotalIcon}</CardContent></Card>
                <Card sx={{ minWidth: 220, flex: 1, bgcolor: theme.palette.primary.main, color: '#fff' }}><CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography sx={{color: '#fff'}}>Ativos</Typography><Typography variant="h4" sx={{color: '#fff'}}>{visitantesAtivos}</Typography></Box>{AtivosIcon}</CardContent></Card>
                <Card sx={{ minWidth: 220, flex: 1 }}><CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography color="text.secondary">Inativos</Typography><Typography variant="h4">{visitantesInativos}</Typography></Box>{InativosIcon}</CardContent></Card>
            </Box>

            {/* Grid de Cards */}
            <Grid container spacing={3}>
                {pessoas.map((pessoa) => (
                    <Grid item xs={12} md={6} lg={4} key={pessoa.id}>
                        <PessoaCard record={pessoa} onEdit={onEdit} onShow={onShow} onDelete={onDelete} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};