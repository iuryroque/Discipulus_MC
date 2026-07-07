import {
    CheckCircle,
    Event,
    Notifications,
    People,
    School,
    TrendingUp
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useGetList } from 'react-admin';

const Dashboard = () => {
    const theme = useTheme();

    const { data: pessoas } = useGetList('pessoa', { pagination: { page: 1, perPage: 1000 } });
    const { data: cultos } = useGetList('culto', { pagination: { page: 1, perPage: 1000 } });
    const { data: acompanhamentos } = useGetList('acompanhamentoEstudo', { pagination: { page: 1, perPage: 1000 } });
    const { data: alertas } = useGetList('alertas', { pagination: { page: 1, perPage: 1000 } });

    const totalPessoas = pessoas?.length || 0;
    const totalCultos = cultos?.length || 0;
    const totalAcompanhamentos = acompanhamentos?.length || 0;
    const totalAlertas = alertas?.length || 0;

    const pessoasAtivas = pessoas?.filter(p => p.status === 'ATIVO').length || 0;
    const pessoasInativas = pessoas?.filter(p => p.status === 'INATIVO').length || 0;
    const estudosEmAndamento = acompanhamentos?.filter(a => a.status === 'Em Andamento').length || 0;

    const statsCards = [
        {
            title: 'Total de Membros',
            value: totalPessoas,
            icon: People,
            color: theme.palette.primary.main,
            subtitle: `${pessoasAtivas} ativos, ${pessoasInativas} inativos`
        },
        {
            title: 'Cultos Realizados',
            value: totalCultos,
            icon: Event,
            color: '#424242',
            subtitle: 'Eventos registrados no sistema'
        },
        {
            title: 'Acompanhamentos',
            value: totalAcompanhamentos,
            icon: School,
            color: theme.palette.secondary.main,
            subtitle: `${estudosEmAndamento} em andamento`
        },
        {
            title: 'Alertas Ativos',
            value: totalAlertas,
            icon: Notifications,
            color: '#616161',
            subtitle: 'Notificações pendentes'
        }
    ];

    const recentActivities = [
        ...([...(pessoas || [])].reverse().slice(0, 2).map(p => ({
            title: 'Membro cadastrado',
            description: p.nomeCompleto,
            icon: People,
        }))),
        ...([...(cultos || [])].reverse().slice(0, 1).map(c => ({
            title: 'Culto registrado',
            description: c.titulo || c.descricao || 'Culto registrado no sistema',
            icon: Event,
        }))),
    ].slice(0, 3);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
                    Bem-vindo ao Discipulus
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sistema de Gestão de Discipulado - Visão Geral
                </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                {statsCards.map((card, index) => (
                    <Card
                        key={index}
                        elevation={2}
                        sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: card.color, width: 56, height: 56, mr: 2 }}>
                                    <card.icon sx={{ fontSize: 28 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: card.color }}>
                                        {card.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.title}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                {card.subtitle}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Card elevation={2}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp color="primary" />
                            Atividades Recentes
                        </Typography>

                        {recentActivities.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                Nenhuma atividade recente.
                            </Typography>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {recentActivities.map((activity, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            borderRadius: 2,
                                            background: `${theme.palette.primary.main}0D`,
                                            border: `1px solid ${theme.palette.primary.main}1A`
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
                                            <activity.icon />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {activity.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {activity.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>

                <Card elevation={1} sx={{ backgroundColor: `${theme.palette.primary.main}1A`, border: `1px solid ${theme.palette.primary.main}33`, display: 'flex', alignItems: 'center' }}>
                    <CardContent sx={{ width: '100%', textAlign: 'center' }}>
                        <CheckCircle sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontStyle: 'italic', color: '#2c3e50', mb: 1 }}>
                            "Ide, portanto, e fazei discípulos de todas as nações..."
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Mateus 28:19
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Dashboard;
