import {
    Add,
    CheckCircle,
    Delete,
    Edit,
    Email,
    Event,
    Group,
    HowToReg,
    Person,
    Phone,
    School,
    Search,
    Visibility,
    Warning
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
    Tooltip,
    Typography
} from '@mui/material';
import React from 'react';
import {
    List,
    SelectInput,
    TextInput,
    useDelete,
    useGetList,
    useNotify,
    useRedirect
} from 'react-admin';

// Componente para exibir pessoa em formato de card
const PessoaCard = ({ record, onEdit, onDelete, onShow, onRegistrarPresenca }) => {
    const getTipoColor = (tipo) => {
        switch (tipo?.toLowerCase()) {
            case 'membro': return 'success';
            case 'visitante': return 'warning';
            case 'interessado': return 'info';
            case 'congregado': return 'primary';
            default: return 'default';
        }
    };

    const getTipoIcon = (tipo) => {
        switch (tipo?.toLowerCase()) {
            case 'membro': return <HowToReg />;
            case 'visitante': return <Person />;
            case 'interessado': return <Group />;
            case 'congregado': return <Person />;
            default: return <Person />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'ativo': return 'success';
            case 'inativo': return 'error';
            case 'pendente': return 'warning';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Não informado';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Não informado';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calcularProgresso = () => {
        if (!record.licaoAtual || !record.totalLicoes) return 0;
        return Math.round((record.licaoAtual / record.totalLicoes) * 100);
    };

    const progresso = calcularProgresso();

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
                {/* Header do Card */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {record.nomeCompleto}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                icon={getTipoIcon(record.tipo)}
                                label={record.tipo}
                                color={getTipoColor(record.tipo)}
                                size="small"
                                sx={{ fontWeight: 600 }}
                            />
                            <Chip
                                label={record.status}
                                color={getStatusColor(record.status)}
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                    <Avatar 
                        sx={{ 
                            bgcolor: getTipoColor(record.tipo) === 'success' ? 'success.main' : 
                                   getTipoColor(record.tipo) === 'warning' ? 'warning.main' : 
                                   getTipoColor(record.tipo) === 'info' ? 'info.main' : 'primary.main'
                        }}
                    >
                        <Person />
                    </Avatar>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Informações de Contato */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        <Phone sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        {record.telefone || 'Não informado'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        <Email sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        {record.email || 'Não informado'}
                    </Typography>
                </Box>

                {/* Último Culto */}
                {record.ultimoCultoNome && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            <Event sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            Último Culto
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {record.ultimoCultoNome}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatDateTime(record.ultimoCultoData)}
                        </Typography>
                    </Box>
                )}

                {/* Progresso de Estudo */}
                {record.curriculoEstudoNome && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            <School sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            Progresso de Estudo
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                            {record.curriculoEstudoNome}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                                {record.licaoAtual || 0}/{record.totalLicoes || 0} lições
                            </Typography>
                            <Chip 
                                label={record.statusAcompanhamento} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                            />
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={progresso} 
                            sx={{ height: 6, borderRadius: 3 }}
                        />
                    </Box>
                )}

                {/* Status de Alerta */}
                {record.temAlertaAtivo && (
                    <Box sx={{ mb: 2 }}>
                        <Chip
                            icon={<Warning />}
                            label={`Alerta: ${record.tipoAlerta}`}
                            color="error"
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            {formatDate(record.dataUltimoAlerta)}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Botões de Ação */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Tooltip title="Ver Detalhes">
                        <IconButton 
                            size="small" 
                            onClick={() => onShow(record.id)}
                            sx={{ color: 'primary.main' }}
                        >
                            <Visibility />
                        </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Editar">
                        <IconButton 
                            size="small" 
                            onClick={() => onEdit(record.id)}
                            sx={{ color: 'warning.main' }}
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Registrar Presença">
                        <IconButton 
                            size="small" 
                            onClick={() => onRegistrarPresenca(record.id)}
                            sx={{ color: 'success.main' }}
                        >
                            <CheckCircle />
                        </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Excluir">
                        <IconButton 
                            size="small" 
                            onClick={() => onDelete(record.id)}
                            sx={{ color: 'error.main' }}
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
};

// Filtros para a lista
const postFilters = [
    <TextInput 
        label="Buscar por nome, telefone ou email" 
        source="nomeCompleto" 
        alwaysOn 
        variant="outlined"
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <Search />
                </InputAdornment>
            ),
        }}
    />,
    <SelectInput 
        label="Tipo" 
        source="tipo" 
        choices={[
            { id: 'MEMBRO', name: 'Membro' },
            { id: 'VISITANTE', name: 'Visitante' },
            { id: 'INTERESSADO', name: 'Interessado' },
            { id: 'CONGREGADO', name: 'Congregado' }
        ]}
        variant="outlined"
    />,
    <SelectInput 
        label="Status" 
        source="status" 
        choices={[
            { id: 'ATIVO', name: 'Ativo' },
            { id: 'INATIVO', name: 'Inativo' },
            { id: 'PENDENTE', name: 'Pendente' }
        ]}
        variant="outlined"
    />
];

// Componente principal da lista
const PessoaCardList = (props) => {
    const redirect = useRedirect();
    const notify = useNotify();
    const [deleteOne] = useDelete();

    const handleEdit = (id) => {
        redirect('edit', 'pessoa', id);
    };

    const handleDelete = async (id) => {
        try {
            await deleteOne('pessoa', { id });
            notify('Pessoa excluída com sucesso!', { type: 'success' });
        } catch (error) {
            notify('Erro ao excluir pessoa', { type: 'error' });
        }
    };

    const handleShow = (id) => {
        redirect('show', 'pessoa', id);
    };

    const handleCreate = () => {
        redirect('create', 'pessoa');
    };

    const handleRegistrarPresenca = (id) => {
        redirect('create', 'presenca', undefined, { pessoaId: id });
    };

    return (
        <List {...props} filters={postFilters} title="Acompanhamento de Visitas">
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                        Acompanhamento de Visitas
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                        sx={{
                            backgroundColor: '#1976D2',
                            '&:hover': {
                                backgroundColor: '#0D47A1'
                            }
                        }}
                    >
                        Nova Pessoa
                    </Button>
                </Box>

                {/* Lista de Pessoas */}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <PessoaCardListContent 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onShow={handleShow}
                            onRegistrarPresenca={handleRegistrarPresenca}
                        />
                    </Grid>
                </Grid>
            </Box>
        </List>
    );
};

// Componente para renderizar os cards
const PessoaCardListContent = ({ onEdit, onDelete, onShow, onRegistrarPresenca }) => {
    const { data: pessoas, isLoading } = useGetList('pessoa/cards', {
        pagination: { page: 1, perPage: 1000 }
    });

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Carregando pessoas...</Typography>
            </Box>
        );
    }

    if (!pessoas || pessoas.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nenhuma pessoa encontrada
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Comece adicionando a primeira pessoa.
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {pessoas.map((pessoa) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={pessoa.id}>
                    <PessoaCard
                        record={pessoa}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onShow={onShow}
                        onRegistrarPresenca={onRegistrarPresenca}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default PessoaCardList; 