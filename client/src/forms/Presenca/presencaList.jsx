import { CheckCircle, Event as EventIcon } from '@mui/icons-material';
import { Box, Button, Card, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useDataProvider, useGetList, useNotify, useRedirect, useRefresh } from 'react-admin';
import { CultoSelector } from './components/CultoSelector';
import { PresencaCard } from './components/PresencaCard';

const PresencaList = () => {
    const [cultoId, setCultoId] = useState('');
    const [aba, setAba] = useState('visitantes');
    const theme = useTheme();
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const [selecionados, setSelecionados] = useState([]);

    const redirect = useRedirect();

    // Buscar todos os cards de pessoas
    const { data: pessoas = [] } = useGetList('pessoa/cards', {
        pagination: { page: 1, perPage: 1000 }
    });

    // Buscar cultos agendados
    const { data: cultos = [] } = useGetList('culto', {
        pagination: { page: 1, perPage: 100 },
        filter: { status: 'Agendado' }
    });

    // Buscar presenças já registradas para o culto selecionado
    const { data: presencas = [] } = useGetList('presenca', {
        pagination: { page: 1, perPage: 1000 },
        filter: cultoId ? { culto: { id: cultoId } } : {} // Filtro ajustado para RA v4+
    });

    const pessoasFiltradas = pessoas.filter(p => {
        if (aba === 'membros') return (p.tipo || '').toLowerCase() === 'membro';
        if (aba === 'visitantes') return (p.tipo || '').toLowerCase() === 'visitante';
        return true;
    });

    const cultoSelecionado = cultos.find(c => String(c.id) === String(cultoId));
    const totalPresencas = presencas.length;

    const handleSalvarPresencas = async () => {
        if (!cultoId) {
            notify('Selecione um culto!', { type: 'warning' });
            return;
        }

        // Monta o payload para o backend
        const payload = selecionados.map(pessoaId => ({
            pessoa: { id: pessoaId },
            culto: { id: parseInt(cultoId) },
            presente: 'SIM'
        }));

        try {
            // Usa o dataProvider para chamar o endpoint customizado
            await dataProvider.create('presenca/bulk', { data: payload });
            notify('Presenças registradas com sucesso!', { type: 'success' });
            setSelecionados([]); // Limpa a seleção
            refresh(); // Atualiza a lista de presenças
        } catch (error) {
            const errorMessage = error.body?.message || 'Erro ao salvar presenças';
            notify(errorMessage, { type: 'error' });
        }
    };

    const handleToggleSelecionado = (pessoaId) => {
        // A função 'setSelecionados' recebe o estado anterior (prev)
        setSelecionados(prev => 
            // Se o ID já está incluído no array...
            prev.includes(pessoaId) 
                // ...retorne um novo array filtrado, SEM esse ID.
                ? prev.filter(id => id !== pessoaId) 
                // Senão (se o ID não está no array)...
                : [...prev, pessoaId] // ...retorne um novo array com o ID adicionado ao final.
        );
    };

    const handleEdit = (pessoaId) => {
        redirect('edit', 'pessoa', pessoaId);
    };

    return (
        <Box sx={{ p: { xs: 1, md: 4 }, bgcolor: '#f6f8fa', minHeight: '100vh' }}>
            <CultoSelector cultoId={cultoId} setCultoId={setCultoId} cultos={cultos} />
            {cultoSelecionado && (
                <Box sx={{ maxWidth: 1200, mx: 'auto', mb: 4 }}>
                    <Card sx={{ background: theme.palette.primary.main, color: '#fff', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: { xs: 2, md: 3 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ bgcolor: theme.palette.primary.dark, borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <EventIcon sx={{ fontSize: 28, color: '#fff' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>{cultoSelecionado.titulo}</Typography>
                                    <Typography variant="body2" sx={{ color: '#fff' }}>
                                        {new Date(cultoSelecionado.dataHora).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>{totalPresencas}</Typography>
                                <Typography variant="body2" sx={{ color: '#fff' }}>Presenças</Typography>
                            </Box>
                        </Box>
                    </Card>
                </Box>
            )}
            {selecionados.length > 0 && (
                <Box sx={{ maxWidth: 1200, mx: 'auto', mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<CheckCircle />}
                        onClick={handleSalvarPresencas} // Criaremos esta função a seguir
                    >
                        Salvar {selecionados.length} Presenças
                    </Button>
                </Box>
            )}

            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Tabs value={aba} onChange={(e, v) => setAba(v)} textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
                    <Tab label="Visitantes" value="visitantes" sx={{ fontWeight: 600 }} />
                    <Tab label="Membros" value="membros" sx={{ fontWeight: 600 }} />
                </Tabs>
                <Grid container spacing={3}>
                    {pessoasFiltradas.map((pessoa) => (
                        <Grid item xs={12} sm={6} md={4} key={pessoa.id}>
                            <PresencaCard 
                                pessoa={pessoa} 
                                isSelected={selecionados.includes(pessoa.id)} 
                                onToggle={handleToggleSelecionado}
                                onEdit={handleEdit}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default PresencaList;