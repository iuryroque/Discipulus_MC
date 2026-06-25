import { CalendarToday, LocationOn, Person, Schedule } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Componente para o próximo culto
export const ProximoCultoCard = ({ culto, onShow }) => {
    const theme = useTheme();
    const formatDate = (dateString) => {
        if (!dateString) return 'Data não definida';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) + ' às ' + date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!culto) {
        return (
            <Card elevation={2} sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white, mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CalendarToday sx={{ fontSize: 40, color: theme.palette.common.white }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: theme.palette.common.white }}>Próximo Culto</Typography>
                            <Typography variant="body1" sx={{ color: theme.palette.common.white }}>Nenhum culto agendado</Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card elevation={2} sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <CalendarToday sx={{ fontSize: 48, color: theme.palette.common.white }} />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, fontSize: '1.5rem', color: theme.palette.common.white }}>Próximo Culto</Typography>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, fontSize: '1.25rem', color: theme.palette.common.white }}>{culto.titulo}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 6, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}><Schedule sx={{ fontSize: 20, color: theme.palette.common.white }} /><Typography variant="body2" sx={{ color: theme.palette.common.white, textAlign: 'left', lineHeight: 1.2 }}>{formatDate(culto.dataHora)}</Typography></Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}><LocationOn sx={{ fontSize: 20, color: theme.palette.common.white }} /><Typography variant="body2" sx={{ color: theme.palette.common.white, textAlign: 'left', lineHeight: 1.2 }}>{culto.local || 'Local não definido'}</Typography></Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}><Person sx={{ fontSize: 20, color: theme.palette.common.white }} /><Typography variant="body2" sx={{ color: theme.palette.common.white, textAlign: 'left', lineHeight: 1.2 }}>{culto.pregador || 'Pregador não definido'}</Typography></Box>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.common.white,
                            color: theme.palette.primary.main,
                            px: 2, py: 1, borderRadius: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                        }}
                        onClick={() => onShow(culto.id)}
                    >
                        Ver Detalhes &gt;
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

ProximoCultoCard.propTypes = {
    culto: PropTypes.object,
    onShow: PropTypes.func,
};