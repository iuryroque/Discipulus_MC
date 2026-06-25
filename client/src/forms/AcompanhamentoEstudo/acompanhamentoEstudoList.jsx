import {
    Add,
    CalendarToday,
    CheckCircle,
    Delete,
    Edit,
    Schedule,
    School,
    Search,
    TrendingUp,
    Visibility
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    LinearProgress,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import {
    Datagrid,
    DateField,
    DeleteButton,
    EditButton,
    List,
    NumberField,
    TextField as RaTextField,
    ShowButton,
    useGetList,
    useRedirect
} from 'react-admin';

// Componente para exibir acompanhamento em formato de card
const AcompanhamentoCard = ({ record, onEdit, onDelete, onShow }) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'em andamento': return 'warning';
            case 'concluído': return 'success';
            case 'pausado': return 'error';
            case 'não iniciado': return 'default';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'em andamento': return <TrendingUp />;
            case 'concluído': return <CheckCircle />;
            case 'pausado': return <Schedule />;
            case 'não iniciado': return <School />;
            default: return <School />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Data não definida';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const calculateProgress = (record) => {
        if (record.status?.toLowerCase() === 'concluído') return 100;
        if (record.status?.toLowerCase() === 'em andamento') return 60;
        if (record.status?.toLowerCase() === 'pausado') return 30;
        return 0;
    };

    const progress = calculateProgress(record);

    return (
        <Card 
            elevation={2}
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
                        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            Acompanhamento #{record.id}
                        </Typography>
                        <Chip
                            icon={getStatusIcon(record.status)}
                            label={record.status}
                            color={getStatusColor(record.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>
                    <Avatar 
                        sx={{ 
                            bgcolor: getStatusColor(record.status) === 'success' ? 'success.main' : 
                                   getStatusColor(record.status) === 'warning' ? 'warning.main' : 
                                   getStatusColor(record.status) === 'error' ? 'error.main' : 'grey.500'
                        }}
                    >
                        <School />
                    </Avatar>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Progresso Visual */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Progresso
                        </Typography>
                        <Typography variant="body2" color="primary" fontWeight={600}>
                            {progress}%
                        </Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'rgba(25, 118, 210, 0.2)',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: getStatusColor(record.status) === 'success' ? '#4CAF50' : 
                                               getStatusColor(record.status) === 'warning' ? '#FF9800' : 
                                               getStatusColor(record.status) === 'error' ? '#F44336' : '#9E9E9E'
                            }
                        }} 
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday color="action" sx={{ fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                            Início: {formatDate(record.dataInicio)}
                        </Typography>
                    </Box>
                    
                    {record.dataConclusao && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle color="action" sx={{ fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                                Conclusão: {formatDate(record.dataConclusao)}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton 
                        size="small" 
                        onClick={() => onShow(record.id)}
                        sx={{ color: 'primary.main' }}
                    >
                        <Visibility />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        onClick={() => onEdit(record.id)}
                        sx={{ color: 'warning.main' }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        onClick={() => onDelete(record.id)}
                        sx={{ color: 'error.main' }}
                    >
                        <Delete />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

// Componente principal da lista
const AcompanhamentoEstudoList = (props) => {
    const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'table'
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const redirect = useRedirect();

    const { data: acompanhamentos, isLoading } = useGetList('acompanhamentoEstudo', {
        pagination: { page: 1, perPage: 1000 }
    });

    const handleEdit = (id) => {
        redirect('edit', 'acompanhamentoEstudo', id);
    };

    const handleDelete = (id) => {
        // Implementar lógica de exclusão
        console.log('Deletar acompanhamento:', id);
    };

    const handleShow = (id) => {
        redirect('show', 'acompanhamentoEstudo', id);
    };

    const handleCreate = () => {
        redirect('create', 'acompanhamentoEstudo');
    };

    const filteredAcompanhamentos = acompanhamentos?.filter(acomp => {
        const matchesSearch = !searchTerm || 
            acomp.status?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = !statusFilter || acomp.status?.toLowerCase() === statusFilter.toLowerCase();
        
        return matchesSearch && matchesStatus;
    }) || [];

    const statusOptions = ['Em Andamento', 'Concluído', 'Pausado', 'Não Iniciado'];

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Carregando acompanhamentos...</Typography>
            </Box>
        );
    }

    // Calcular estatísticas
    const totalAcompanhamentos = filteredAcompanhamentos.length;
    const emAndamento = filteredAcompanhamentos.filter(a => a.status?.toLowerCase() === 'em andamento').length;
    const concluidos = filteredAcompanhamentos.filter(a => a.status?.toLowerCase() === 'concluído').length;
    const pausados = filteredAcompanhamentos.filter(a => a.status?.toLowerCase() === 'pausado').length;
    const naoIniciados = filteredAcompanhamentos.filter(a => a.status?.toLowerCase() === 'não iniciado').length;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                        Acompanhamento de Estudos
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                        sx={{ borderRadius: 2 }}
                    >
                        Novo Acompanhamento
                    </Button>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    Gerencie o acompanhamento dos estudos dos discípulos
                </Typography>
            </Box>

            {/* Filtros e Controles */}
            <Card elevation={1} sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por status..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                size="small"
                            >
                                <option value="">Todos os status</option>
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant={viewMode === 'cards' ? 'contained' : 'outlined'}
                                    onClick={() => setViewMode('cards')}
                                    size="small"
                                >
                                    Cards
                                </Button>
                                <Button
                                    variant={viewMode === 'table' ? 'contained' : 'outlined'}
                                    onClick={() => setViewMode('table')}
                                    size="small"
                                >
                                    Tabela
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={1} sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                                {emAndamento}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Em Andamento
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={1} sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                                {concluidos}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Concluídos
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={1} sx={{ backgroundColor: 'rgba(244, 67, 54, 0.1)' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
                                {pausados}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Pausados
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={1} sx={{ backgroundColor: 'rgba(158, 158, 158, 0.1)' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 700 }}>
                                {naoIniciados}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Não Iniciados
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Lista de Acompanhamentos */}
            {viewMode === 'cards' ? (
                <Grid container spacing={3}>
                    {filteredAcompanhamentos.map((acomp) => (
                        <Grid item xs={12} sm={6} md={4} key={acomp.id}>
                            <AcompanhamentoCard
                                record={acomp}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onShow={handleShow}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <List {...props} filters={[]} pagination={false}>
                    <Datagrid>
                        <NumberField source="id" label="ID" />
                        <RaTextField source="status" label="Status" />
                        <DateField source="dataInicio" label="Data Início" />
                        <DateField source="dataConclusao" label="Data Conclusão" />
                        <ShowButton />
                        <EditButton />
                        <DeleteButton />
                    </Datagrid>
                </List>
            )}

            {filteredAcompanhamentos.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Nenhum acompanhamento encontrado
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {searchTerm || statusFilter ? 'Tente ajustar os filtros de busca.' : 'Comece criando o primeiro acompanhamento.'}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default AcompanhamentoEstudoList;

    
