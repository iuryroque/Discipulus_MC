import { CheckCircle, Email, HowToReg, Person, Phone } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardContent, Checkbox, Chip, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Card para exibir uma única pessoa na lista de chamada
export const PresencaCard = ({ pessoa, onRegistrarPresenca, isSelected, onToggle }) => {
    const theme = useTheme();

    const getAvatarColor = (nome) => {
        if (!nome) return theme.palette.avatar.azul;
        const letra = nome.trim().charAt(0).toUpperCase();
        switch (letra) {
            case 'F': return theme.palette.avatar.laranja;
            case 'M': return theme.palette.avatar.azul;
            case 'T': return theme.palette.avatar.laranja;
            default: return theme.palette.avatar.roxo;
        }
    };

    const getTipoTagColor = (tipo) => {
        switch ((tipo || '').toLowerCase()) {
            case 'visitante': return theme.palette.chip.visitante;
            case 'membro': return theme.palette.chip.membro;
            default: return 'default';
        }
    };

    const getStatusTagColor = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'ativo': return theme.palette.chip.ativo;
            case 'inativo': return theme.palette.chip.inativo;
            default: return 'default';
        }
    };

    const getTipoIcon = (tipo) => {
        switch ((tipo || '').toLowerCase()) {
            case 'membro': return <HowToReg fontSize="small" />;
            case 'visitante': return <Person fontSize="small" />;
            default: return <Person fontSize="small" />;
        }
    };

    return (
        <Card 
        onClick={() => onToggle(pessoa.id)}
        sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            borderRadius: 3,
            boxShadow: '0 2px 8px #F0F1F2',
            border: '1px solid #E5EAF2',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
        }}>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: getAvatarColor(pessoa.nomeCompleto), width: 40, height: 40, color: '#fff', fontWeight: 700, fontSize: 20 }}>
                            {pessoa.nomeCompleto?.charAt(0)?.toUpperCase() || 'P'}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>{pessoa.nomeCompleto}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip icon={getTipoIcon(pessoa.tipo)} label={pessoa.tipo} size="small" variant="filled" sx={{ fontWeight: 600, bgcolor: getTipoTagColor(pessoa.tipo), color: theme.palette.common.white }} />
                                <Chip label={pessoa.status} size="small" variant="outlined" sx={{ fontWeight: 600, bgcolor: getStatusTagColor(pessoa.status), color: theme.palette.common.white, border: 'none' }} />
                            </Box>
                        </Box>
                    </Box>
                    <Checkbox
                        checked={isSelected}
                        onChange={() => onToggle(pessoa.id)}
                    />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><Phone sx={{ fontSize: 16, color: '#6b7280' }} /><Typography variant="body2" color="text.secondary">{pessoa.telefone || 'Não informado'}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Email sx={{ fontSize: 16, color: '#6b7280' }} /><Typography variant="body2" color="text.secondary">{pessoa.email || 'Não informado'}</Typography></Box>
                </Box>
                <Button variant="contained" startIcon={<CheckCircle />} onClick={() => onRegistrarPresenca(pessoa.id)} fullWidth sx={{ mt: 'auto', bgcolor: theme.palette.primary.main, color: '#fff', fontWeight: 600, fontSize: 16, py: 1.2, borderRadius: 2, boxShadow: '0 2px 8px #3b82f6cc', '&:hover': { bgcolor: theme.palette.primary.dark } }}>
                    Registrar Presença
                </Button>
            </CardContent>
        </Card>
    );
};