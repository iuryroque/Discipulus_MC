import {
    Edit,
    Email,
    Event,
    Phone,
    Visibility,
    Warning
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Este componente renderiza um único card de visitante.
export const PessoaCard = ({ record, onEdit, onShow, onDelete }) => {
    const theme = useTheme();

    const formatDate = (dateString) => {
        if (!dateString) return 'Não informado';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px #F0F1F2', p: 2, border: '1px solid #E5EAF2', height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48, fontWeight: 700, fontSize: 22 }}>
                            {record.nomeCompleto?.charAt(0)?.toUpperCase() || 'V'}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', mb: 0.5 }}>
                                {record.nomeCompleto}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip label="Visitante" size="small" sx={{ bgcolor: theme.palette.chip.visitante, color: theme.palette.common.white, fontWeight: 600 }} />
                                {record.status === 'ATIVO' && (
                                    <Chip label="ATIVO" size="small" sx={{ bgcolor: theme.palette.chip.ativo, color: theme.palette.common.white, fontWeight: 600 }} />
                                )}
                                {record.status === 'INATIVO' && (
                                    <Chip label="INATIVO" size="small" sx={{ bgcolor: theme.palette.chip.inativo, color: theme.palette.common.white, fontWeight: 600 }} />
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Visualizar"><IconButton size="small" onClick={() => onShow(record.id)}><Visibility /></IconButton></Tooltip>
                        <Tooltip title="Editar"><IconButton size="small" onClick={() => onEdit(record.id)}><Edit /></IconButton></Tooltip>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                        <Typography variant="body2" color="text.secondary">{record.telefone || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                        <Typography variant="body2" color="text.secondary">{record.email || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Event sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                        <Typography variant="body2" color="text.secondary">Último Culto: {record.ultimoCultoNome || 'N/A'}</Typography>
                    </Box>
                </Box>
                {record.temAlertaAtivo && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 1, bgcolor: 'warning.light' }}>
                        <Warning sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="body2" color="warning.dark" sx={{ fontWeight: 500 }}>
                            Alerta: {record.tipoAlerta} em {formatDate(record.dataUltimoAlerta)}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};