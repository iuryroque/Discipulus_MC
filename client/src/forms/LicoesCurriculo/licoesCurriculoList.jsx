import {
    Assignment as AssignmentIcon,
    Book as BookIcon,
    Clear as ClearIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    FilterList as FilterIcon,
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
    Datagrid,
    DeleteButton,
    EditButton,
    Grid,
    IconButton,
    LinearProgress,
    List,
    NumberField,
    NumberInput,
    Paper,
    ReferenceField,
    ReferenceInput,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
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
                            <TextInput
                                source="titulo"
                                label="Título da Lição"
                                variant="outlined"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextInput
                                source="conteudo"
                                label="Conteúdo"
                                variant="outlined"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <NumberInput
                                source="numeroLicao"
                                label="Número da Lição"
                                variant="outlined"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextInput
                                source="duracao"
                                label="Duração"
                                variant="outlined"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <ReferenceInput
                                source="curriculoEstudo.id"
                                reference="curriculoEstudo"
                                label="Currículo"
                                variant="outlined"
                                fullWidth
                                size="small"
                            >
                                <SelectInput optionText="nome" />
                            </ReferenceInput>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <NumberInput
                                source="ordem"
                                label="Ordem"
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
        curriculos: new Set(data?.map(item => item.curriculoEstudo?.id) || []).size,
        mediaDuracao: data?.length ? 
            Math.round(data.reduce((acc, item) => acc + (parseInt(item.duracao) || 0), 0) / data.length) : 0,
        comObjetivos: data?.filter(item => item.objetivos)?.length || 0
    };

    const statCards = [
        {
            title: 'Total de Lições',
            value: stats.total,
            icon: <BookIcon />,
            color: theme.palette.primary.main,
            bgColor: theme.palette.primary.light + '20'
        },
        {
            title: 'Currículos',
            value: stats.curriculos,
            icon: <SchoolIcon />,
            color: theme.palette.secondary.main,
            bgColor: theme.palette.secondary.light + '20'
        },
        {
            title: 'Duração Média',
            value: `${stats.mediaDuracao} min`,
            icon: <TimerIcon />,
            color: theme.palette.info.main,
            bgColor: theme.palette.info.light + '20'
        },
        {
            title: 'Com Objetivos',
            value: stats.comObjetivos,
            icon: <AssignmentIcon />,
            color: theme.palette.success.main,
            bgColor: theme.palette.success.light + '20'
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

// Componente de card para lição
const LicaoCard = ({ record, onEdit, onShow, onDelete }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);

    const getStatusColor = (ordem) => {
        if (ordem <= 3) return theme.palette.success.main;
        if (ordem <= 6) return theme.palette.warning.main;
        return theme.palette.info.main;
    };

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
                            {record.titulo}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip 
                                label={`Lição ${record.numeroLicao}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                            <Chip 
                                label={`Ordem ${record.ordem}`}
                                size="small"
                                sx={{ 
                                    backgroundColor: getStatusColor(record.ordem) + '20',
                                    color: getStatusColor(record.ordem)
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
                        <TimerIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="body2" color="text.secondary">
                            {record.duracao}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SchoolIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="body2" color="text.secondary">
                            {record.curriculoEstudo?.nome}
                        </Typography>
                    </Box>
                </Box>

                <Collapse in={expanded}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Conteúdo:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {record.conteudo?.substring(0, 150)}...
                        </Typography>
                        
                        {record.objetivos && (
                            <>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <strong>Objetivos:</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {record.objetivos?.substring(0, 100)}...
                                </Typography>
                            </>
                        )}

                        {record.materiais && (
                            <>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <strong>Materiais:</strong>
                                </Typography>
                                <Typography variant="body2">
                                    {record.materiais?.substring(0, 100)}...
                                </Typography>
                            </>
                        )}
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

const LicoesCurriculoList = props => {
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
        window.location.href = `#/licoesCurriculo/${id}/edit`;
    };

    const handleShow = (id) => {
        // Navegação para visualização
        window.location.href = `#/licoesCurriculo/${id}/show`;
    };

    const handleDelete = (id) => {
        // Lógica de exclusão
        if (confirm('Tem certeza que deseja excluir esta lição?')) {
            // Implementar exclusão
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <LinearProgress />
                <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                    Carregando lições...
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
                        Lições do Currículo
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Gerencie as lições dos currículos de estudo
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
                        <LicaoCard 
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
                        <ReferenceField source="curriculoEstudo.id" reference="curriculoEstudo" label="Currículo">
                            <TextField source="nome" />
                        </ReferenceField>
                        <NumberField source="numeroLicao" label="Número" />
                        <TextField source="titulo" label="Título" />
                        <TextField source="duracao" label="Duração" />
                        <NumberField source="ordem" label="Ordem" />
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

export default LicoesCurriculoList;

    
