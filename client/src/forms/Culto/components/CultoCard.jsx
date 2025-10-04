import {
    Clear,
    Delete,
    Edit,
    Event,
    LocationOn,
    Person,
    Schedule,
    Visibility
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Avatar as MuiAvatar,
    Tooltip,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Componente para exibir culto em formato de card
export const CultoCard = ({ record, onEdit, onDelete, onShow }) => {
    const theme = useTheme();
    // getStatusColor was removed because styles are derived directly from theme in the chips

    const getStatusIcon = (status) => {
        const iconProps = { sx: { color: theme.palette.common.white, fontSize: 18 } };
        switch (status?.toLowerCase()) {
            case 'agendado': return <Schedule {...iconProps} />;
            case 'realizado': return <Event {...iconProps} />;
            case 'cancelado': return <Clear {...iconProps} />;
            default: return <Event {...iconProps} />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Data não definida';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDayOfWeek = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        return days[date.getDay()];
    };

    return (
        <Card
            elevation={2}
            sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                position: 'relative',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header do Card */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {record.titulo}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Visualizar"><IconButton size="small" onClick={() => onShow(record.id)}><Visibility /></IconButton></Tooltip>
                        <Tooltip title="Editar"><IconButton size="small" onClick={() => onEdit(record.id)}><Edit /></IconButton></Tooltip>
                        <Tooltip title="Excluir"><IconButton size="small" onClick={() => onDelete(record.id)}><Delete /></IconButton></Tooltip>
                    </Box>
                </Box>

                {/* Status Chips */}
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <Chip
                        label="Culto"
                        size="small"
                        variant="filled"
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.common.white,
                            fontWeight: 700,
                            borderRadius: 1,
                            letterSpacing: 1,
                            boxShadow: 1,
                            px: 1
                        }}
                    />

                    <Chip
                        avatar={(
                            <MuiAvatar sx={{ bgcolor: 'transparent', width: 24, height: 24 }}>
                                {getStatusIcon(record.status)}
                            </MuiAvatar>
                        )}
                        label={(record.status || '').toUpperCase()}
                        size="small"
                        variant="filled"
                        sx={{
                            fontWeight: 600,
                            bgcolor:
                                record.status?.toLowerCase() === 'agendado' ? theme.palette.primary.main :
                                record.status?.toLowerCase() === 'realizado' ? theme.palette.success.main :
                                record.status?.toLowerCase() === 'cancelado' ? theme.palette.error.main : theme.palette.grey[400],
                            color: theme.palette.common.white,
                            border: 0,
                            textTransform: 'uppercase'
                        }}
                    />
                </Box>

                {/* Conteúdo Principal */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <MuiAvatar
                        sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: theme.palette.primary.main,
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: theme.palette.common.white
                        }}
                    >
                        {getDayOfWeek(record.dataHora)}
                    </MuiAvatar>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><LocationOn sx={{ fontSize: 18, color: theme.palette.text.secondary }} /><Typography variant="body2" color="text.secondary">{record.local || 'Local não definido'}</Typography></Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Person sx={{ fontSize: 18, color: theme.palette.text.secondary }} /><Typography variant="body2" color="text.secondary">{record.pregador || 'Pregador não definido'}</Typography></Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Schedule sx={{ fontSize: 18, color: theme.palette.text.secondary }} /><Typography variant="body2" color="text.secondary">{formatDate(record.dataHora)}</Typography></Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

CultoCard.propTypes = {
    record: PropTypes.object.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onShow: PropTypes.func,
};