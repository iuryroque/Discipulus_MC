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
                        <Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}>
                            {record.nomeCompleto?.charAt(0)?.toUpperCase() || 'V'}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                {record.nomeCompleto}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip
                                    icon={<Person />}
                                    label="Visitante"
                                    size="small"
                                    color="warning"
                                    variant="filled"
                                    sx={{ fontWeight: 600 }}
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
    const cardListRef = React.useRef();

    const handleEdit = (id) => {
        // Salvar o ID da pessoa sendo editada para atualizar depois
        sessionStorage.setItem('editingPessoaId', id);
        redirect('edit', 'pessoa', id);
    };

    const handleDelete = async (id) => {
        try {
            await deleteOne('pessoa', { id });
            notify('Visitante excluído com sucesso!', { type: 'success' });
            // Atualizar a lista após exclusão
            if (cardListRef.current) {
                cardListRef.current.refreshData();
            }
        } catch (error) {
            notify('Erro ao excluir visitante', { type: 'error' });
        }
    };

    const handleShow = (id) => {
        redirect('show', 'pessoa', id);
    };

    const handleCreate = () => {
        // Marcar que uma nova pessoa será criada
        sessionStorage.setItem('creatingNewPessoa', 'true');
        redirect('create', 'pessoa');
    };

    const handleRegistrarPresenca = (id) => {
        redirect('create', 'presenca', undefined, { pessoaId: id });
    };

    // Efeito para verificar se houve mudanças quando retorna à tela
    React.useEffect(() => {
        const checkForUpdates = () => {
            const editingId = sessionStorage.getItem('editingPessoaId');
            const creatingNew = sessionStorage.getItem('creatingNewPessoa');
            
            if (editingId || creatingNew) {
                // Limpar os marcadores
                sessionStorage.removeItem('editingPessoaId');
                sessionStorage.removeItem('creatingNewPessoa');
                
                // Atualizar os dados
                if (cardListRef.current) {
                    setTimeout(() => {
                        cardListRef.current.refreshData();
                    }, 500); // Pequeno delay para garantir que a operação foi concluída
                }
            }
        };

        // Verificar a cada 2 segundos se houve mudanças
        const interval = setInterval(checkForUpdates, 2000);
        
        // Verificar imediatamente ao montar o componente
        checkForUpdates();

        return () => clearInterval(interval);
    }, []);

    const postFilters = [
        <TextInput 
            label="Buscar visitante por nome, telefone ou email" 
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
        />
    ];

    return (
        <List {...props} 
            // filters={postFilters} 
            title="Acompanhamento de Visitantes"
        >
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            Acompanhamento de Visitantes
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            Gerencie e acompanhe o progresso dos visitantes da igreja
                        </Typography>
                    </Box>
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
                        Novo Visitante
                    </Button>
                </Box>

                {/* Estatísticas */}
                <Box sx={{ mb: 3 }}>
                    <PessoaCardListContent 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onShow={handleShow}
                        onRegistrarPresenca={handleRegistrarPresenca}
                        showStats={true}
                    />
                </Box>

                {/* Lista de Pessoas */}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <PessoaCardListContent 
                            ref={cardListRef}
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
const PessoaCardListContent = React.forwardRef(({ onEdit, onDelete, onShow, onRegistrarPresenca, showStats = false }, ref) => {
    const { data: pessoas, isLoading, error, refetch } = useGetList('pessoa/cards', {
        pagination: { page: 1, perPage: 1000 }
    });

    // Função para atualizar os dados
    const handleDataUpdate = () => {
        refetch();
    };

    // Expor a função de atualização para o componente pai
    React.useImperativeHandle(ref, () => ({
        refreshData: handleDataUpdate
    }));

    // Se houver erro, mostrar mensagem
    if (error) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Warning sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                <Typography variant="h6" color="error.main" gutterBottom>
                    Erro ao carregar visitantes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {error.message || 'Verifique sua conexão e tente novamente.'}
                </Typography>
            </Box>
        );
    }

    // Se showStats for true, renderizar apenas estatísticas
    if (showStats) {
        if (isLoading) return null;
        
        const totalVisitantes = pessoas?.length || 0;
        const visitantesAtivos = pessoas?.filter(p => p.status === 'ATIVO')?.length || 0;
        const visitantesInativos = pessoas?.filter(p => p.status === 'INATIVO')?.length || 0;

        // Ícones
        const TotalIcon = <Group sx={{ fontSize: 32, color: '#1976D2' }} />;
        const AtivosIcon = <Group sx={{ fontSize: 32, color: '#fff' }} />;
        const InativosIcon = <Group sx={{ fontSize: 32, color: '#B0B0B0' }} />;

        return (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                {/* Total de Visitantes */}
                <Card sx={{ minWidth: 220, flex: 1, bgcolor: '#fff', boxShadow: 0, border: '1px solid #E5EAF2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <CardContent sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Total de Visitantes
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#222' }}>
                                {totalVisitantes}
                            </Typography>
                        </Box>
                        {TotalIcon}
                    </CardContent>
                </Card>
                {/* Visitantes Ativos (destaque azul) */}
                <Card sx={{ minWidth: 220, flex: 1, bgcolor: '#1976D2', color: '#fff', boxShadow: 0, border: '1px solid #1976D2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <CardContent sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="body2" sx={{ mb: 0.5, color: '#fff' }}>
                                Visitantes Ativos
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                                {visitantesAtivos}
                            </Typography>
                        </Box>
                        {AtivosIcon}
                    </CardContent>
                </Card>
                {/* Visitantes Inativos */}
                <Card sx={{ minWidth: 220, flex: 1, bgcolor: '#fff', boxShadow: 0, border: '1px solid #E5EAF2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <CardContent sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Visitantes Inativos
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#222' }}>
                                {visitantesInativos}
                            </Typography>
                        </Box>
                        {InativosIcon}
                    </CardContent>
                </Card>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Carregando visitantes...</Typography>
            </Box>
        );
    }

    if (!pessoas || pessoas.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nenhum visitante encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Comece adicionando o primeiro visitante.
                </Typography>
            </Box>
        );
    }

    // Cards de visitantes
    return (
        <Grid container spacing={2}>
            {pessoas.map((pessoa) => (
                <Grid item xs={12} md={6} key={pessoa.id}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px #F0F1F2', p: 2, border: '1px solid #E5EAF2' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: '#1976D2', width: 48, height: 48, fontWeight: 700, fontSize: 22 }}>
                                    {pessoa.nomeCompleto?.charAt(0)?.toUpperCase() || 'V'}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', mb: 0.5 }}>
                                        {pessoa.nomeCompleto}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Chip label="Visitante" size="small" sx={{ bgcolor: '#1976D2', color: '#fff', fontWeight: 600 }} />
                                        {pessoa.status === 'ATIVO' && (
                                            <Chip label="ATIVO" size="small" sx={{ bgcolor: '#22C55E', color: '#fff', fontWeight: 600 }} />
                                        )}
                                        {pessoa.status === 'INATIVO' && (
                                            <Chip label="INATIVO" size="small" sx={{ bgcolor: '#F87171', color: '#fff', fontWeight: 600 }} />
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                            {/* Ícones de ação */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Visualizar">
                                    <IconButton size="small" onClick={() => onShow(pessoa.id)}>
                                        <Visibility />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Editar">
                                    <IconButton size="small" onClick={() => onEdit(pessoa.id)}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                        {/* Informações de contato */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone sx={{ fontSize: 18, color: '#1976D2' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {pessoa.telefone || 'N/A'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email sx={{ fontSize: 18, color: '#1976D2' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {pessoa.email || 'N/A'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Event sx={{ fontSize: 18, color: '#1976D2' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {pessoa.ultimoCultoNome || 'N/A'}
                                </Typography>
                            </Box>
                        </Box>
                        {/* Botão Registrar Presença */}
                        <Button
                            variant="contained"
                            startIcon={<CheckCircle />}
                            onClick={() => onRegistrarPresenca(pessoa.id)}
                            fullWidth
                            sx={{ mt: 1, bgcolor: '#1976D2', color: '#fff', fontWeight: 600, fontSize: 16, py: 1.2, borderRadius: 2, '&:hover': { bgcolor: '#115293' } }}
                        >
                            Registrar Presença
                        </Button>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
});

export default PessoaCardList; 