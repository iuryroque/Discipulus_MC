import {
    AccessTime,
    Add,
    Book,
    CheckCircle,
    Delete,
    Edit,
    Grade,
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
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import {
    Datagrid,
    DeleteButton,
    EditButton,
    List,
    NumberField,
    TextField as RaTextField,
    ShowButton,
    useGetList,
    useRedirect,
    useTheme
} from 'react-admin';
import AuditList from '../../components/AuditList';

// Componente para exibir currículo em formato de card
const CurriculoCard = ({ record, onEdit, onDelete, onShow }) => {
    const theme = useTheme();
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'ativo': return 'success';
            case 'inativo': return 'error';
            case 'em desenvolvimento': return 'warning';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'ativo': return <CheckCircle />;
            case 'inativo': return <School />;
            case 'em desenvolvimento': return <TrendingUp />;
            default: return <Book />;
        }
    };

    const getNivelColor = (nivel) => {
        switch (nivel?.toLowerCase()) {
            case 'básico': return 'success';
            case 'intermediário': return 'warning';
            case 'avançado': return 'error';
            default: return 'default';
        }
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
                        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {record.nome}
                        </Typography>
                        <Chip
                            icon={getStatusIcon(record.status)}
                            label={record.status}
                            color={getStatusColor(record.status)}
                            size="small"
                            sx={{ fontWeight: 600, mb: 1 }}
                        />
                    </Box>
                    <Avatar 
                        sx={{ 
                            bgcolor: getStatusColor(record.status) === 'success' ? theme.palette.success.light : 
                                   getStatusColor(record.status) === 'error' ? theme.palette.error.light : 
                                   getStatusColor(record.status) === 'warning' ? theme.palette.warning.light : theme.palette.grey[200]
                        }}
                    >
                        <Book />
                    </Avatar>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Descrição */}
                {record.descricao && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {record.descricao}
                        </Typography>
                    </Box>
                )}

                {/* Informações do Currículo */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Grade color="action" sx={{ fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                            Nível: 
                        </Typography>
                        <Chip
                            label={record.nivel}
                            color={getNivelColor(record.nivel)}
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                    
                    {record.duracao && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime color="action" sx={{ fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                                Duração: {record.duracao}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Audit Info */}
                <Box sx={{ mb: 3 }}>
                    <AuditList />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton 
                        size="small" 
                        onClick={() => onShow(record.id)}
                        sx={{ color: theme.palette.primary.main }}
                    >
                        <Visibility />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        onClick={() => onEdit(record.id)}
                        sx={{ color: theme.palette.warning.main }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        onClick={() => onDelete(record.id)}
                        sx={{ color: theme.palette.error.main }}
                    >
                        <Delete />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

// Componente principal da lista
const CurriculoEstudoList = (props) => {
    const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'table'
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [nivelFilter, setNivelFilter] = useState('');
    const redirect = useRedirect();
    const theme = useTheme();

    const { data: curriculos, isLoading } = useGetList('curriculoEstudo', {
        pagination: { page: 1, perPage: 1000 }
    });

    const handleEdit = (id) => {
        redirect('edit', 'curriculoEstudo', id);
    };

    const handleDelete = (id) => {
        // Implementar lógica de exclusão
        console.log('Deletar currículo:', id);
    };

    const handleShow = (id) => {
        redirect('show', 'curriculoEstudo', id);
    };

    const handleCreate = () => {
        redirect('create', 'curriculoEstudo');
    };

    const filteredCurriculos = curriculos?.filter(curriculo => {
        const matchesSearch = !searchTerm || 
            curriculo.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            curriculo.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = !statusFilter || curriculo.status?.toLowerCase() === statusFilter.toLowerCase();
        const matchesNivel = !nivelFilter || curriculo.nivel?.toLowerCase() === nivelFilter.toLowerCase();
        
        return matchesSearch && matchesStatus && matchesNivel;
    }) || [];

    const statusOptions = ['Ativo', 'Inativo', 'Em Desenvolvimento'];
    const nivelOptions = ['Básico', 'Intermediário', 'Avançado'];

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Carregando currículos...</Typography>
            </Box>
        );
    }

    // Calcular estatísticas
    const totalCurriculos = filteredCurriculos.length;
    const ativos = filteredCurriculos.filter(c => c.status?.toLowerCase() === 'ativo').length;
    const inativos = filteredCurriculos.filter(c => c.status?.toLowerCase() === 'inativo').length;
    const emDesenvolvimento = filteredCurriculos.filter(c => c.status?.toLowerCase() === 'em desenvolvimento').length;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                        Currículos de Estudo
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                        sx={{ borderRadius: 2 }}
                    >
                        Novo Currículo
                    </Button>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    Gerencie os currículos e programas de estudo
                </Typography>
            </Box>

            {/* Filtros e Controles */}
            <Card elevation={1} sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por nome ou descrição..."
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
                        <Grid item xs={12} md={2}>
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
                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                select
                                label="Nível"
                                value={nivelFilter}
                                onChange={(e) => setNivelFilter(e.target.value)}
                                size="small"
                            >
                                <option value="">Todos os níveis</option>
                                {nivelOptions.map((nivel) => (
                                    <option key={nivel} value={nivel}>
                                        {nivel}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
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
                    <Card elevation={1} sx={{ backgroundColor: theme.palette.success.light }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                                {ativos}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ativos
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card elevation={1} sx={{ backgroundColor: theme.palette.error.light }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
                                {inativos}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Inativos
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card elevation={1} sx={{ backgroundColor: theme.palette.warning.light }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                                {emDesenvolvimento}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Em Desenvolvimento
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Lista de Currículos */}
            {viewMode === 'cards' ? (
                <Grid container spacing={3}>
                    {filteredCurriculos.map((curriculo) => (
                        <Grid item xs={12} sm={6} md={4} key={curriculo.id}>
                            <CurriculoCard
                                record={curriculo}
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
                        <RaTextField source="nome" label="Nome do Currículo" />
                        <RaTextField source="descricao" label="Descrição" />
                        <RaTextField source="nivel" label="Nível" />
                        <RaTextField source="duracao" label="Duração" />
                        <RaTextField source="status" label="Status" />
                        <AuditList />
                        <ShowButton />
                        <EditButton />
                        <DeleteButton />
                    </Datagrid>
                </List>
            )}

            {filteredCurriculos.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Book sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Nenhum currículo encontrado
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {searchTerm || statusFilter || nivelFilter ? 'Tente ajustar os filtros de busca.' : 'Comece criando o primeiro currículo.'}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default CurriculoEstudoList;

    
