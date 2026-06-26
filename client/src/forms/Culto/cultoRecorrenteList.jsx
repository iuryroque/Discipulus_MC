import {
    CalendarToday,
    CheckCircle,
    Event,
    FilterList,
    LocationOn,
    Person,
    Refresh,
    Schedule,
    Settings,
    Warning
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    LinearProgress,
    Tooltip,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import React, { useState } from 'react';
import {
    Datagrid,
    FunctionField,
    List,
    SelectInput,
    TextField,
    useDataProvider,
    useGetList,
    useNotify,
    useRecordContext
} from 'react-admin';
import { DotChip, ListActions } from '../../components/SharedListActions';

const diasSemanaMap = {
    'DOMINGO': 'Domingo',
    'SEGUNDA': 'Segunda-feira',
    'TERCA': 'Terça-feira',
    'QUARTA': 'Quarta-feira',
    'QUINTA': 'Quinta-feira',
    'SEXTA': 'Sexta-feira',
    'SABADO': 'Sábado'
};

const ActionButtons = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const handleGerarCultos = async () => {
        setLoading(true);
        try {
            const result = await dataProvider.custom('culto-recorrente', {
                action: `${record.id}/gerar-cultos`,
                data: {}
            });
            
            // Verifica se a resposta tem dados válidos
            if (result && result.data) {
                const cultosGerados = Array.isArray(result.data) ? result.data : [];
                const quantidade = cultosGerados.length;
                const titulo = record.titulo || 'esta configuração';
                notify(
                    `${quantidade} cultos gerados para "${titulo}"!`, 
                    'success'
                );
            } else {
                const titulo = record.titulo || 'esta configuração';
                notify(
                    `Cultos gerados com sucesso para "${titulo}"!`, 
                    'success'
                );
            }
        } catch (error) {
            console.error('Erro ao gerar cultos:', error);
            notify(
                'Erro ao gerar cultos para esta configuração', 
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Gerar cultos para esta configuração">
                <IconButton
                    onClick={handleGerarCultos}
                    disabled={loading}
                    size="small"
                    sx={{ 
                        color: theme.palette.success?.main || '#4CAF50',
                        '&:hover': {
                            backgroundColor: theme.palette.success?.light || '#81C784'
                        }
                    }}
                >
                    <Schedule />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

const StatisticsCard = ({ title, value, icon, color, subtitle }) => {
    const theme = useTheme();
    return (
        <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                        backgroundColor: theme.palette[color]?.light || theme.palette.primary.light, 
                        color: theme.palette[color]?.main || theme.palette.primary.main,
                        p: 1, 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {icon}
                    </Box>
                    <Box>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: theme.palette[color]?.main || theme.palette.primary.main }}>
                            {value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const CultoRecorrenteList = props => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    // Buscar dados para estatísticas
    const { data: configs, isLoading: loadingConfigs } = useGetList('culto-recorrente', {
        pagination: { page: 1, perPage: 1000 }
    });

    const handleGerarCultosProximoMes = async () => {
        setLoading(true);
        try {
            const result = await dataProvider.custom('culto-recorrente', {
                action: 'gerar-cultos-proximo-mes',
                data: {}
            });
            
            // Verifica se a resposta tem dados válidos
            if (result && result.data) {
                const cultosGerados = Array.isArray(result.data) ? result.data : [];
                const quantidade = cultosGerados.length;
                notify(
                    `${quantidade} cultos gerados para o próximo mês!`, 
                    'success'
                );
            } else {
                notify(
                    'Cultos gerados com sucesso!', 
                    'success'
                );
            }
        } catch (error) {
            console.error('Erro ao gerar cultos:', error);
            notify(
                'Erro ao gerar cultos do próximo mês', 
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    // Calcular estatísticas
    const totalConfigs = configs?.length || 0;
    const configsAtivas = configs?.filter(c => c.ativo)?.length || 0;
    const configsInativas = totalConfigs - configsAtivas;
    
    const hoje = new Date();
    const configsVigentes = configs?.filter(c => {
        const dataInicio = new Date(c.dataInicio);
        const dataFim = c.dataFim ? new Date(c.dataFim) : null;
        return hoje >= dataInicio && (!dataFim || hoje <= dataFim);
    })?.length || 0;

    return (
        <>
            {/* Header com Estatísticas */}
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    fontWeight: 600, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    mb: 2
                                }}>
                                    <Schedule color="primary" />
                                    Geração Manual de Cultos
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={loading ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : <Schedule />}
                                        onClick={handleGerarCultosProximoMes}
                                        disabled={loading}
                                        sx={{
                                            backgroundColor: theme.palette.success?.main || '#4CAF50',
                                            '&:hover': {
                                                backgroundColor: theme.palette.success?.dark || '#388E3C'
                                            }
                                        }}
                                    >
                                        {loading ? 'Gerando...' : 'Gerar Cultos do Próximo Mês'}
                                    </Button>
                                    
                                    <Alert severity="info" sx={{ flex: 1 }}>
                                        <Typography variant="body2">
                                            <strong>Dica:</strong> Use este botão para gerar manualmente 
                                            os cultos do próximo mês baseado nas configurações ativas.
                                        </Typography>
                                    </Alert>
                                </Box>

                                {/* Informações sobre Jobs Agendados */}
                                <Box sx={{ 
                                    backgroundColor: theme.palette.background.default, 
                                    p: 2, 
                                    borderRadius: 2,
                                    border: `1px solid ${theme.palette.divider}`
                                }}>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: theme.palette.primary.main }}>
                                        🕐 Jobs Agendados Ativos:
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip size="small" label="Mensal" color="primary" variant="outlined" />
                                                <Typography variant="body2">
                                                    Todo dia 1º às 02:00
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip size="small" label="Semanal" color="secondary" variant="outlined" />
                                                <Typography variant="body2">
                                                    Todo domingo às 06:00
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip size="small" label="Diário" color="success" variant="outlined" />
                                                <Typography variant="body2">
                                                    Todo dia às 00:05
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    fontWeight: 600, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    mb: 2
                                }}>
                                    <Settings color="primary" />
                                    Informações
                                </Typography>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle color="success" />
                                        <Typography variant="body2">
                                            <strong>Configurações Ativas:</strong> Geram cultos automaticamente
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Warning color="warning" />
                                        <Typography variant="body2">
                                            <strong>Configurações Inativas:</strong> Não geram cultos
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarToday color="info" />
                                        <Typography variant="body2">
                                            <strong>Vigência:</strong> Período de geração de cultos
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <FilterList color="action" />
                                        <Typography variant="body2">
                                            <strong>Filtros:</strong> Use os filtros para encontrar configurações
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Loading */}
            {loadingConfigs && (
                <Box sx={{ mb: 2 }}>
                    <LinearProgress />
                </Box>
            )}

            {/* Lista de Configurações */}
            <List 
                {...props} 
                title="Configurações de Cultos Recorrentes"
                actions={<ListActions createLabel="Nova Configuração" />}
                filters={[
                    <TextField 
                        source="titulo" 
                        label="Título" 
                        sx={{ fontWeight: 600 }}
                    />,
                    <TextField source="local" label="Local" />,
                    <TextField source="pregador" label="Pregador" />,
                    <SelectInput 
                        source="ativo" 
                        label="Status" 
                        choices={[
                            { id: true, name: 'Ativo' },
                            { id: false, name: 'Inativo' }
                        ]}
                        optionText="name"
                        optionValue="id"
                    />
                ]}
                sx={{
                    '& .RaList-content': {
                        backgroundColor: theme.palette.background.default
                    }
                }}
            >
                <Datagrid 
                    rowClick="edit"
                    bulkActionButtons={false}
                    sx={{
                        '& .RaDatagrid-row': {
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover
                            }
                        },
                        '& .RaDatagrid-headerCell': {
                            backgroundColor: theme.palette.grey[100],
                            fontWeight: 600
                        }
                    }}
                >
                    <TextField 
                        source="titulo" 
                        label="Título" 
                        sx={{ fontWeight: 600 }}
                    />
                    
                    <FunctionField
                        label="Dia & Hora"
                        render={record => {
                            // Formatar dataInicio e hora
                            let data = '';
                            if (record.dataInicio) {
                                try {
                                    data = format(new Date(record.dataInicio), 'dd/MM/yyyy');
                                } catch {}
                            }
                            let hora = record.hora;
                            // Se vier como string ISO, tenta extrair hora
                            if (typeof hora === 'string' && hora.includes('T')) {
                                try {
                                    const d = new Date(hora);
                                    hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                } catch {}
                            } else if (typeof hora === 'string') {
                                // Se vier como '19:45:00' ou '19:45', pega só os dois primeiros blocos
                                const parts = hora.split(':');
                                if (parts.length >= 2) {
                                    hora = `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
                                }
                            } else if (hora instanceof Date) {
                                hora = hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                            }
                            return (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Event color="action" fontSize="small" />
                                    <Box>
                                        <Typography variant="body2" fontWeight={500}>
                                            {diasSemanaMap[record.diaSemana] || record.diaSemana} {data}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {hora}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        }}
                    />
                    
                    <FunctionField
                        label="Local"
                        render={record => (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn color="action" fontSize="small" />
                                <Typography variant="body2">
                                    {record.local}
                                </Typography>
                            </Box>
                        )}
                    />
                    
                    <FunctionField
                        label="Pregador"
                        render={record => (
                            record.pregador ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Person color="action" fontSize="small" />
                                    <Typography variant="body2">
                                        {record.pregador}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Não definido
                                </Typography>
                            )
                        )}
                    />
                    
                    <FunctionField
                        source="ativo"
                        label="Ativo"
                        render={record => (
                            <DotChip
                                value={record.ativo ? 'ATIVO' : 'INATIVO'}
                                colorMap={{ ATIVO: '#4caf50', INATIVO: '#f44336' }}
                                labelMap={{ ATIVO: 'Ativo', INATIVO: 'Inativo' }}
                            />
                        )}
                    />

                    <FunctionField
                        source="vigencia"
                        label="Vigência"
                        render={record => {
                            const hoje = new Date();
                            const dataInicio = new Date(record.dataInicio);
                            const dataFim = record.dataFim ? new Date(record.dataFim) : null;
                            let key = 'VIGENTE';
                            if (hoje < dataInicio) key = 'FUTURO';
                            else if (dataFim && hoje > dataFim) key = 'EXPIRADO';
                            return (
                                <DotChip
                                    value={key}
                                    colorMap={{ VIGENTE: '#4caf50', FUTURO: '#ff9800', EXPIRADO: '#f44336' }}
                                    labelMap={{ VIGENTE: 'Vigente', FUTURO: 'Futuro', EXPIRADO: 'Expirado' }}
                                />
                            );
                        }}
                    />
                    
                    <ActionButtons />
                </Datagrid>
            </List>
        </>
    );
};

export default CultoRecorrenteList; 