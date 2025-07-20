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
    Chip,
    Grid,
    IconButton,
    LinearProgress,
    Tooltip,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import {
    CreateButton,
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

const diasSemanaMap = {
    'DOMINGO': 'Domingo',
    'SEGUNDA': 'Segunda-feira',
    'TERCA': 'Terça-feira',
    'QUARTA': 'Quarta-feira',
    'QUINTA': 'Quinta-feira',
    'SEXTA': 'Sexta-feira',
    'SABADO': 'Sábado'
};

const StatusField = ({ record }) => {
    if (!record) return null;
    
    const isAtivo = record.ativo;
    
    return (
        <Chip
            label={isAtivo ? 'Ativo' : 'Inativo'}
            color={isAtivo ? 'success' : 'error'}
            size="small"
            variant="outlined"
            icon={isAtivo ? <CheckCircle fontSize="small" /> : <Warning fontSize="small" />}
            sx={{
                fontWeight: 600,
                borderWidth: 2
            }}
        />
    );
};

const VigenciaField = ({ record }) => {
    if (!record) return null;
    
    const hoje = new Date();
    const dataInicio = new Date(record.dataInicio);
    const dataFim = record.dataFim ? new Date(record.dataFim) : null;
    
    let color = 'success';
    let label = 'Vigente';
    let icon = <CheckCircle fontSize="small" />;
    
    if (hoje < dataInicio) {
        color = 'warning';
        label = 'Futuro';
        icon = <CalendarToday fontSize="small" />;
    } else if (dataFim && hoje > dataFim) {
        color = 'error';
        label = 'Expirado';
        icon = <Warning fontSize="small" />;
    }
    
    return (
        <Chip
            label={label}
            color={color}
            size="small"
            variant="outlined"
            icon={icon}
            sx={{
                fontWeight: 600,
                borderWidth: 2
            }}
        />
    );
};

const ActionButtons = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [loading, setLoading] = useState(false);

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
                        color: '#4CAF50',
                        '&:hover': {
                            backgroundColor: 'rgba(76, 175, 80, 0.1)'
                        }
                    }}
                >
                    <Schedule />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

const StatisticsCard = ({ title, value, icon, color, subtitle }) => (
    <Card elevation={1} sx={{ height: '100%' }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                    backgroundColor: `${color}.light`, 
                    color: `${color}.main`,
                    p: 1, 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: `${color}.main` }}>
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

const CultoRecorrenteList = props => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [loading, setLoading] = useState(false);

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
                                            backgroundColor: '#4CAF50',
                                            '&:hover': {
                                                backgroundColor: '#45a049'
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
                                    backgroundColor: 'rgba(25, 118, 210, 0.05)', 
                                    p: 2, 
                                    borderRadius: 2,
                                    border: '1px solid rgba(25, 118, 210, 0.1)'
                                }}>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: '#1976D2' }}>
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
                actions={<CreateButton label="Nova Configuração" />}
                filters={[
                    <TextField 
                        source="titulo" 
                        label="Título" 
                        alwaysOn
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
                        backgroundColor: '#fafafa'
                    }
                }}
            >
                <Datagrid 
                    rowClick="edit"
                    bulkActionButtons={false}
                    sx={{
                        '& .RaDatagrid-row': {
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.04)'
                            }
                        },
                        '& .RaDatagrid-headerCell': {
                            backgroundColor: '#f5f5f5',
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
                        render={record => (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Event color="action" fontSize="small" />
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        {diasSemanaMap[record.diaSemana] || record.diaSemana}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {record.hora}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
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
                            <Chip
                                label={record.ativo ? 'Ativo' : 'Inativo'}
                                color={record.ativo ? 'success' : 'error'}
                                size="small"
                                variant="outlined"
                                icon={record.ativo ? <CheckCircle fontSize="small" /> : <Warning fontSize="small" />}
                                sx={{
                                    fontWeight: 600,
                                    borderWidth: 2
                                }}
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
                            
                            let color = 'success';
                            let label = 'Vigente';
                            let icon = <CheckCircle fontSize="small" />;
                            
                            if (hoje < dataInicio) {
                                color = 'warning';
                                label = 'Futuro';
                                icon = <CalendarToday fontSize="small" />;
                            } else if (dataFim && hoje > dataFim) {
                                color = 'error';
                                label = 'Expirado';
                                icon = <Warning fontSize="small" />;
                            }
                            
                            return (
                                <Chip
                                    label={label}
                                    color={color}
                                    size="small"
                                    variant="outlined"
                                    icon={icon}
                                    sx={{
                                        fontWeight: 600,
                                        borderWidth: 2
                                    }}
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