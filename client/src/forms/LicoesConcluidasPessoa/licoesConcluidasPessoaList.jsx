import {
    Book as BookIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    Clear as ClearIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    FilterList as FilterIcon,
    People as PeopleIcon,
    Person as PersonIcon,
    PlayArrow as PlayIcon,
    School as SchoolIcon,
    Timer as TimerIcon,
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
    Datagrid,
    DateField,
    DateInput,
    DeleteButton,
    EditButton,
    List,
    NumberField,
    ReferenceField,
    ReferenceInput,
    SelectInput,
    ShowButton,
    TextField,
    TextInput
} from 'react-admin';
import AuditList from '../../components/AuditList';

// Componente de filtros avançados
const AdvancedFilter = ({ onFilterChange, filters }) => {
    const [open, setOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (field, value) => {
        const newFilters = { ...localFilters, [field]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {};
        setLocalFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    return (
        <>
            <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => setOpen(!open)}
                    size="small"
                >
                    Filtros Avançados
                </Button>
                {Object.keys(filters).some(key => filters[key]) && (
                    <Button
                        variant="text"
                        startIcon={<ClearIcon />}
                        onClick={clearFilters}
                        size="small"
                        color="error"
                    >
                        Limpar
                    </Button>
                )}
            </Box>

            <Collapse in={open}>
                <Paper sx={{ p: 2, mb: 2, backgroundColor: 'background.default' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <ReferenceInput
                                source="pessoa.id"
                                reference="pessoa"
                                label="Pessoa"
                                variant="outlined"
                                fullWidth
                                size="small"
                            >
                                <SelectInput optionText="nomeCompleto" />
                            </ReferenceInput>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <ReferenceInput
                                source="licoesCurriculo.id"
                                reference="licoesCurriculo"
                                label="Lição"
                                variant="outlined"
                                fullWidth
                                size="small"
                            >
                                <SelectInput optionText="titulo" />
                            </ReferenceInput>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <DateInput
                                source="dataConclusao"
                                label="Data de Conclusão"
                                variant="outlined"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextInput
                                source="observacoes"
                                label="Observações"
                                variant="outlined"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Collapse>
        </>
    );
};

// Componente de estatísticas
const StatisticsCards = ({ data }) => {
    const theme = useTheme();

    const stats = {
        total: data?.length || 0,
        pessoas: new Set(data?.map(item => item.pessoa?.id) || []).size,
        licoes: new Set(data?.map(item => item.licoesCurriculo?.id) || []).size,
        esteMes: data?.filter(item => {
            const dataConclusao = new Date(item.dataConclusao);
            const hoje = new Date();
            return dataConclusao.getMonth() === hoje.getMonth() && 
                   dataConclusao.getFullYear() === hoje.getFullYear();
        })?.length || 0
    };

    const statCards = [
        {
            title: 'Total de Conclusões',
            value: stats.total,
            icon: <CheckCircleIcon />,
            color: theme.palette.success.main,
            bgColor: theme.palette.success.light + '20'
        },
        {
            title: 'Pessoas Ativas',
            value: stats.pessoas,
            icon: <PeopleIcon />,
            color: theme.palette.primary.main,
            bgColor: theme.palette.primary.light + '20'
        },
        {
            title: 'Lições Concluídas',
            value: stats.licoes,
            icon: <BookIcon />,
            color: theme.palette.info.main,
            bgColor: theme.palette.info.light + '20'
        },
        {
            title: 'Este Mês',
            value: stats.esteMes,
            icon: <CalendarIcon />,
            color: theme.palette.warning.main,
            bgColor: theme.palette.warning.light + '20'
        }
    ];

    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {statCards.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card 
                        sx={{ 
                            height: '100%',
                            background: `linear-gradient(135deg, ${stat.bgColor} 0%, ${stat.bgColor}40 100%)`,
                            border: `1px solid ${stat.color}30`
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box 
                                    sx={{ 
                                        p: 1, 
                                        borderRadius: 2, 
                                        backgroundColor: stat.color + '20',
                                        color: stat.color,
                                        mr: 2
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                                    {stat.value}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {stat.title}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

// Componente de card para lição concluída
const LicaoConcluidaCard = ({ record, onEdit, onShow, onDelete }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);

    const getDaysAgo = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusColor = (daysAgo) => {
        if (daysAgo <= 7) return theme.palette.success.main;
        if (daysAgo <= 30) return theme.palette.warning.main;
        return theme.palette.info.main;
    };

    const daysAgo = getDaysAgo(record.dataConclusao);

    return (
        <Card 
            sx={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                            {record.licoesCurriculo?.titulo}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip 
                                label="Concluída"
                                size="small"
                                color="success"
                                icon={<CheckCircleIcon />}
                            />
                            <Chip 
                                label={`${daysAgo} dias atrás`}
                                size="small"
                                sx={{ 
                                    backgroundColor: getStatusColor(daysAgo) + '20',
                                    color: getStatusColor(daysAgo)
                                }}
                            />
                        </Box>
                    </Box>
                    <IconButton 
                        size="small" 
                        onClick={() => setExpanded(!expanded)}
                        sx={{ color: theme.palette.text.secondary }}
                    >
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="body2" color="text.secondary">
                            {record.pessoa?.nomeCompleto}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="body2" color="text.secondary">
                            {new Date(record.dataConclusao).toLocaleDateString('pt-BR')}
                        </Typography>
                    </Box>
                </Box>

                <Collapse in={expanded}>
                    <Box sx={{ mb: 2 }}>
                        {record.observacoes && (
                            <>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <strong>Observações:</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {record.observacoes}
                                </Typography>
                            </>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <SchoolIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                            <Typography variant="body2" color="text.secondary">
                                Currículo: {record.licoesCurriculo?.curriculoEstudo?.nome}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimerIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                            <Typography variant="body2" color="text.secondary">
                                Duração: {record.licoesCurriculo?.duracao}
                            </Typography>
                        </Box>
                    </Box>
                </Collapse>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Visualizar">
                            <IconButton size="small" onClick={() => onShow(record.id)}>
                                <PlayIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => onEdit(record.id)}>
                                <EditButton />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                            <IconButton size="small" onClick={() => onDelete(record.id)}>
                                <DeleteButton />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <AuditList record={record} />
                </Box>
            </CardContent>
        </Card>
    );
};

const LicoesConcluidasPessoaList = props => {
    const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'table'
    const [filters, setFilters] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simular carregamento de dados
    useEffect(() => {
        // Aqui você faria a chamada real para a API
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        // Aqui você aplicaria os filtros na API
    };

    const handleEdit = (id) => {
        // Navegação para edição
        window.location.href = `#/licoesConcluidasPessoa/${id}/edit`;
    };

    const handleShow = (id) => {
        // Navegação para visualização
        window.location.href = `#/licoesConcluidasPessoa/${id}/show`;
    };

    const handleDelete = (id) => {
        // Lógica de exclusão
        if (confirm('Tem certeza que deseja excluir esta conclusão?')) {
            // Implementar exclusão
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <LinearProgress />
                <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                    Carregando conclusões...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                        Lições Concluídas
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Acompanhe o progresso das pessoas nos currículos
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Visualização em Cards">
                        <IconButton 
                            onClick={() => setViewMode('cards')}
                            color={viewMode === 'cards' ? 'primary' : 'default'}
                        >
                            <ViewModuleIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Visualização em Lista">
                        <IconButton 
                            onClick={() => setViewMode('table')}
                            color={viewMode === 'table' ? 'primary' : 'default'}
                        >
                            <ViewListIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Filtros */}
            <AdvancedFilter onFilterChange={handleFilterChange} filters={filters} />

            {/* Estatísticas */}
            <StatisticsCards data={data} />

            {/* Conteúdo */}
            {viewMode === 'cards' ? (
                <List {...props} filters={[]} pagination={false}>
                    <Datagrid bulkActionButtons={false}>
                        <LicaoConcluidaCard 
                            onEdit={handleEdit}
                            onShow={handleShow}
                            onDelete={handleDelete}
                        />
                    </Datagrid>
                </List>
            ) : (
                <List {...props} filters={[]}>
                    <Datagrid>
                        <NumberField source="id" label="ID" />
                        <ReferenceField source="pessoa.id" reference="pessoa" label="Pessoa">
                            <TextField source="nomeCompleto" />
                        </ReferenceField>
                        <ReferenceField source="licoesCurriculo.id" reference="licoesCurriculo" label="Lição">
                            <TextField source="titulo" />
                        </ReferenceField>
                        <DateField source="dataConclusao" label="Data de Conclusão" />
                        <TextField source="observacoes" label="Observações" />
                        <AuditList />
                        <ShowButton />
                        <EditButton />
                        <DeleteButton />
                    </Datagrid>
                </List>
            )}
        </Box>
    );
};

export default LicoesConcluidasPessoaList;

    
