import { Group, Person, Warning } from '@mui/icons-material';
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useListContext } from 'react-admin';
import { PessoaCard } from './PessoaCard';

// Este componente renderiza as estatísticas e a grade de cards.
export const PessoaCardGrid = ({ onEdit, onShow, onDelete }) => {
    const { data: pessoas, total, isLoading, error } = useListContext();
    const theme = useTheme();

    if (isLoading) {
        return (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                {Array.from(new Array(6)).map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
                ))}
            </Box>
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
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
                <Card sx={{ height: '100%' }}><CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography color="text.secondary">Total</Typography><Typography variant="h4">{total}</Typography></Box>{TotalIcon}</CardContent></Card>
                <Card sx={{ height: '100%', bgcolor: theme.palette.primary.main, color: '#fff' }}><CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography sx={{color: '#fff'}}>Ativos</Typography><Typography variant="h4" sx={{color: '#fff'}}>{visitantesAtivos}</Typography></Box>{AtivosIcon}</CardContent></Card>
                <Card sx={{ height: '100%' }}><CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography color="text.secondary">Inativos</Typography><Typography variant="h4">{visitantesInativos}</Typography></Box>{InativosIcon}</CardContent></Card>
            </Box>

            {/* Grid de Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                {pessoas.map((pessoa) => (
                    <PessoaCard key={pessoa.id} record={pessoa} onEdit={onEdit} onShow={onShow} onDelete={onDelete} />
                ))}
            </Box>
        </>
    );
};