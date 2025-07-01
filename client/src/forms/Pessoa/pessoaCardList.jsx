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
import { usePessoaEnumOptions } from '../../hooks/useEnumOptions';

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
        <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
        }}>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Header do Card */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                            {record.nomeCompleto?.charAt(0)?.toUpperCase() || 'P'}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                {record.nomeCompleto}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip
                                    icon={getTipoIcon(record.tipo)}
                                    label={record.tipo}
                                    size="small"
                                    color={getTipoColor(record.tipo)}
                                    variant="outlined"
                                />
                                <Chip
                                    label={record.status}
                                    size="small"
                                    color={getStatusColor(record.status)}
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                    </Box>
                    
                    {/* Menu de Ações */}
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

                <Divider sx={{ my: 2 }} />

                {/* Informações de Contato */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {record.telefone || 'Não informado'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {record.email || 'Não informado'}
                        </Typography>
                    </Box>
                </Box>

                {/* Último Culto */}
                {record.ultimoCultoNome && (
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Event sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                Último culto: {record.ultimoCultoNome}
                            </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            {formatDateTime(record.ultimoCultoData)}
                        </Typography>
                    </Box>
                )}

                {/* Progresso de Estudo */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <School sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {record.curriculoEstudoNome}
                        </Typography>
                    </Box>
                    {record.totalLicoes > 0 && (
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Progresso
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {record.licaoAtual}/{record.totalLicoes}
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={(record.licaoAtual / record.totalLicoes) * 100}
                                sx={{ height: 6, borderRadius: 3 }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Alertas */}
                {record.temAlertaAtivo && (
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Warning sx={{ fontSize: 16, color: 'warning.main' }} />
                            <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
                                Alerta: {record.tipoAlerta}
                            </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            {formatDate(record.dataUltimoAlerta)}
                        </Typography>
                    </Box>
                )}

                {/* Botão de Registrar Presença */}
                <Button
                    variant="outlined"
                    startIcon={<CheckCircle />}
                    onClick={() => onRegistrarPresenca(record.id)}
                    fullWidth
                    sx={{ mt: 'auto' }}
                >
                    Registrar Presença
                </Button>
            </CardContent>
        </Card>
    );
};

const PessoaCardList = (props) => {
    const redirect = useRedirect();
    const notify = useNotify();
    const [deleteOne] = useDelete();
    const { statusOptions, tipoOptions, loading } = usePessoaEnumOptions();

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
            choices={tipoOptions}
            variant="outlined"
        />,
        <SelectInput 
            label="Status" 
            source="status" 
            choices={statusOptions}
            variant="outlined"
        />
    ];

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