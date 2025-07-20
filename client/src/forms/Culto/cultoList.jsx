import {
    Add,
    CalendarToday,
    Clear,
    Delete,
    Download,
    Edit,
    Event,
    LocationOn,
    Person,
    Schedule,
    Visibility
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    IconButton,
    Avatar as MuiAvatar,
    Tooltip,
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
        const iconProps = { sx: { color: '#fff', fontSize: 18 } };
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
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: '#2c3e50', flex: 1 }}>
                        {record.titulo}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Visualizar">
                            <IconButton size="small" onClick={() => onShow(record.id)}>
                                <Visibility />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => onEdit(record.id)}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                            <IconButton size="small" onClick={() => onDelete(record.id)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Status Chips */}
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <Chip
                        label="Culto"
                        size="small"
                        variant="outlined"
                        sx={{ 
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            color: 'primary.main',
                            borderColor: 'primary.main'
                        }}
                    />
                    <Chip
                        avatar={(
                            <MuiAvatar sx={{ bgcolor: 'transparent', width: 24, height: 24 }}>
                                {getStatusIcon(record.status)}
                            </MuiAvatar>
                        )}
                        label={record.status?.toUpperCase()}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            bgcolor:
                                record.status?.toLowerCase() === 'agendado' ? '#1976D2' :
                                record.status?.toLowerCase() === 'realizado' ? '#22C55E' :
                                record.status?.toLowerCase() === 'cancelado' ? '#F87171' : '#B0B0B0',
                            color: '#fff',
                            border: 0
                        }}
                    />
                </Box>

                {/* Conteúdo Principal */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    {/* Avatar com dia da semana */}
                    <Avatar
                        sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: 'primary.main',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'white'
                        }}
                    >
                        {getDayOfWeek(record.dataHora)}
                    </Avatar>

                    {/* Detalhes */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {record.local || 'Local não definido'}
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {record.pregador || 'Pregador não definido'}
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {formatDate(record.dataHora)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>


            </CardContent>
        </Card>
    );
};

// Componente para o próximo culto
const ProximoCultoCard = ({ culto, onShow }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Data não definida';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) + ' às ' + date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!culto) {
        return (
            <Card elevation={2} sx={{ backgroundColor: 'primary.main', color: 'white', mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CalendarToday sx={{ fontSize: 40, color: 'white' }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                                Próximo Culto
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                                Nenhum culto agendado
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card elevation={2} sx={{ backgroundColor: 'primary.main', color: 'white', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <CalendarToday sx={{ fontSize: 48, color: 'white' }} />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, fontSize: '1.5rem', color: 'white' }}>
                            Próximo Culto
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, fontSize: '1.25rem', color: 'white' }}>
                            {culto.titulo}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 6, mb: 2 }}>
    {/* Data */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}>
        <Schedule sx={{ fontSize: 20, color: 'white' }} />
        <Typography variant="body2" sx={{ color: 'white', textAlign: 'left', lineHeight: 1.2 }}>
            {formatDate(culto.dataHora)}
        </Typography>
    </Box>
    {/* Local */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}>
        <LocationOn sx={{ fontSize: 20, color: 'white' }} />
        <Typography variant="body2" sx={{ color: 'white', textAlign: 'left', lineHeight: 1.2 }}>
            {culto.local || 'Local não definido'}
        </Typography>
    </Box>
    {/* Pregador */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}>
        <Person sx={{ fontSize: 20, color: 'white' }} />
        <Typography variant="body2" sx={{ color: 'white', textAlign: 'left', lineHeight: 1.2 }}>
            {culto.pregador || 'Pregador não definido'}
        </Typography>
    </Box>
</Box>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{ 
                            backgroundColor: 'white', 
                            color: 'primary.main',
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.9)'
                            }
                        }}
                        onClick={() => onShow(culto.id)}
                    >
                        Ver Detalhes &gt;
                    </Button>
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

    // Encontrar o próximo culto (primeiro culto agendado no futuro)
    const now = new Date();
    const proximoCulto = filteredCultos
        .filter(c => c.status?.toLowerCase() === 'agendado' && new Date(c.dataHora) > now)
        .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))[0];

    // Ordenar cultos por data/hora crescente
    const cultosOrdenados = [...filteredCultos].sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));

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
                    <Box>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                            Gestão de Cultos
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Gerencie os cultos e eventos da igreja
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<Download />}
                            sx={{
                                backgroundColor: '#1976D2',
                                color: '#fff',
                                fontWeight: 600,
                                borderRadius: 2,
                                fontSize: 16,
                                py: 1.2,
                                minWidth: 140,
                                '&:hover': { backgroundColor: '#115293' }
                            }}
                        >
                            Exportar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleCreate}
                            sx={{
                                backgroundColor: '#1976D2',
                                color: '#fff',
                                fontWeight: 600,
                                borderRadius: 2,
                                fontSize: 16,
                                py: 1.2,
                                minWidth: 140,
                                '&:hover': { backgroundColor: '#115293' }
                            }}
                        >
                            + Novo Culto
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Próximo Culto */}
            <ProximoCultoCard culto={proximoCulto} onShow={handleShow} />

            {/* Estatísticas */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Card elevation={1}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                                {filteredCultos.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total de Cultos
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card elevation={1} sx={{ backgroundColor: 'primary.main', color: 'white' }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                                {filteredCultos.filter(c => c.status?.toLowerCase() === 'agendado').length}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                                Cultos Agendados
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card elevation={1}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                                {filteredCultos.filter(c => c.status?.toLowerCase() === 'realizado').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Cultos Realizados
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Seção Todos os Cultos */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50', mb: 2 }}>
                    Todos os Cultos
                </Typography>
            </Box>

            {/* Lista de Cultos */}
            {viewMode === 'cards' ? (
                <Grid container spacing={3}>
                    {cultosOrdenados.map((culto) => (
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