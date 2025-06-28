import {
    Add,
    Clear,
    Delete,
    Edit,
    Event,
    LocationOn,
    Person,
    Schedule,
    Search,
    Visibility
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
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
    TextField as RaTextField,
    ShowButton,
    useGetList,
    useRedirect
} from 'react-admin';

// Componente para exibir culto em formato de card
const CultoCard = ({ record, onEdit, onDelete, onShow }) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'agendado': return 'warning';
            case 'realizado': return 'success';
            case 'cancelado': return 'error';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'agendado': return <Schedule />;
            case 'realizado': return <Event />;
            case 'cancelado': return <Clear />;
            default: return <Event />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Data não definida';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
                            {record.titulo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {record.descricao}
                        </Typography>
                    </Box>
                    <Chip
                        icon={getStatusIcon(record.status)}
                        label={record.status}
                        color={getStatusColor(record.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn color="action" sx={{ fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                            {record.local || 'Local não definido'}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person color="action" sx={{ fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                            {record.pregador || 'Pregador não definido'}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule color="action" sx={{ fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(record.dataHora)}
                        </Typography>
                    </Box>
                </Box>

                {record.observacoes && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Observações:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {record.observacoes}
                        </Typography>
                    </Box>
                )}

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
const CultoList = (props) => {
    const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'table'
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const redirect = useRedirect();

    const { data: cultos, isLoading } = useGetList('culto', {
        pagination: { page: 1, perPage: 1000 }
    });

    const handleEdit = (id) => {
        redirect('edit', 'culto', id);
    };

    const handleDelete = (id) => {
        // Implementar lógica de exclusão
        console.log('Deletar culto:', id);
    };

    const handleShow = (id) => {
        redirect('show', 'culto', id);
    };

    const handleCreate = () => {
        redirect('create', 'culto');
    };

    const filteredCultos = cultos?.filter(culto => {
        const matchesSearch = !searchTerm || 
            culto.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            culto.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            culto.local?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            culto.pregador?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = !statusFilter || culto.status?.toLowerCase() === statusFilter.toLowerCase();
        
        return matchesSearch && matchesStatus;
    }) || [];

    const statusOptions = ['Agendado', 'Realizado', 'Cancelado'];

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Carregando cultos...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                        Gestão de Cultos
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                        sx={{ borderRadius: 2 }}
                    >
                        Novo Culto
                    </Button>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    Gerencie os cultos e eventos da igreja
                </Typography>
            </Box>

            {/* Filtros e Controles */}
            <Card elevation={1} sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por título, descrição, local ou pregador..."
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
                <Grid item xs={12} sm={4}>
                    <Card elevation={1} sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                                {filteredCultos.filter(c => c.status?.toLowerCase() === 'agendado').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Agendados
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card elevation={1} sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                                {filteredCultos.filter(c => c.status?.toLowerCase() === 'realizado').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Realizados
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card elevation={1} sx={{ backgroundColor: 'rgba(244, 67, 54, 0.1)' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
                                {filteredCultos.filter(c => c.status?.toLowerCase() === 'cancelado').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Cancelados
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Lista de Cultos */}
            {viewMode === 'cards' ? (
                <Grid container spacing={3}>
                    {filteredCultos.map((culto) => (
                        <Grid item xs={12} sm={6} md={4} key={culto.id}>
                            <CultoCard
                                record={culto}
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
                        <RaTextField source="titulo" label="Título" />
                        <RaTextField source="local" label="Local" />
                        <DateField source="dataHora" label="Data/Hora" />
                        <RaTextField source="pregador" label="Pregador" />
                        <RaTextField source="status" label="Status" />
                        <ShowButton />
                        <EditButton />
                        <DeleteButton />
                    </Datagrid>
                </List>
            )}

            {filteredCultos.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Event sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Nenhum culto encontrado
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {searchTerm || statusFilter ? 'Tente ajustar os filtros de busca.' : 'Comece criando o primeiro culto.'}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default CultoList; 