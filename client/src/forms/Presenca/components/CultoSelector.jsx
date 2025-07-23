import { Event as EventIcon } from '@mui/icons-material';
import { Box, Card, FormControl, MenuItem, OutlinedInput, Select, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Seletor de Culto
export const CultoSelector = ({ cultoId, setCultoId, cultos }) => {
    const theme = useTheme();

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#222', mb: 0.5 }}>Controle de Presença</Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 3 }}>Registre a presença dos membros e visitantes</Typography>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px #E5EAF2', p: 0, border: '1px solid #E5EAF2' }}>
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                    <Tooltip title="Selecione o Culto" arrow>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 1, fontSize: 16 }}>
                            Selecione o Culto
                        </Typography>
                    </Tooltip>
                    <FormControl fullWidth>
                        <Select
                            value={cultoId}
                            displayEmpty
                            onChange={e => setCultoId(e.target.value)}
                            input={<OutlinedInput />}
                            sx={{
                                fontWeight: 600, fontSize: 16, borderRadius: 2, bgcolor: '#f8fafc',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main, boxShadow: '0 0 0 2px #3b82f633' },
                            }}
                        >
                            {cultos.map(culto => (
                                <MenuItem key={culto.id} value={culto.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EventIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                        <span>{culto.titulo} - {new Date(culto.dataHora).toLocaleString('pt-BR')}</span>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Card>
        </Box>
    );
};