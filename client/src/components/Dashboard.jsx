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
    Grid,
    Typography
} from '@mui/material';
import { useGetList, useTranslate } from 'react-admin';

const Dashboard = () => {
    const translate = useTranslate();

    // Buscar dados para o dashboard
    const { data: pessoas, isLoading: loadingPessoas } = useGetList('pessoa', {
        pagination: { page: 1, perPage: 1000 }
    });
    
    const { data: cultos, isLoading: loadingCultos } = useGetList('culto', {
        pagination: { page: 1, perPage: 1000 }
    });
    
    const { data: acompanhamentos, isLoading: loadingAcompanhamentos } = useGetList('acompanhamentoEstudo', {
        pagination: { page: 1, perPage: 1000 }
    });
    
    const { data: alertas, isLoading: loadingAlertas } = useGetList('alertas', {
        pagination: { page: 1, perPage: 1000 }
    });

    // Calcular estatísticas
    const totalPessoas = pessoas?.length || 0;
    const totalCultos = cultos?.length || 0;
    const totalAcompanhamentos = acompanhamentos?.length || 0;
    const totalAlertas = alertas?.length || 0;
    
    // Pessoas por status
    const pessoasAtivas = pessoas?.filter(p => p.status === 'Ativo')?.length || 0;
    const pessoasInativas = pessoas?.filter(p => p.status === 'Inativo')?.length || 0;
    
    // Progresso de estudos
    const estudosEmAndamento = acompanhamentos?.filter(a => a.status === 'Em Andamento')?.length || 0;
    const estudosConcluidos = acompanhamentos?.filter(a => a.status === 'Concluído')?.length || 0;
    const progressoEstudos = totalAcompanhamentos > 0 ? (estudosConcluidos / totalAcompanhamentos) * 100 : 0;

    const statsCards = [
        {
            title: 'Total de Membros',
            value: totalPessoas,
            icon: People,
            color: '#1976D2',
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
            color: '#42A5F5',
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
        {
            type: 'member',
            title: 'Novo membro cadastrado',
            description: 'João Silva foi adicionado ao sistema',
            time: '2 horas atrás',
            icon: People
        },
        {
            type: 'study',
            title: 'Estudo concluído',
            description: 'Maria Santos finalizou o módulo básico',
            time: '1 dia atrás',
            icon: CheckCircle
        },
        {
            type: 'event',
            title: 'Culto registrado',
            description: 'Culto de domingo com 45 presentes',
            time: '2 dias atrás',
            icon: Event
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
                    Bem-vindo ao Discipulus
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sistema de Gestão de Discipulado - Visão Geral
                </Typography>
            </Box>

            {/* Cards de Estatísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statsCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
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
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar 
                                        sx={{ 
                                            bgcolor: card.color,
                                            width: 56,
                                            height: 56,
                                            mr: 2
                                        }}
                                    >
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
                    </Grid>
                ))}
            </Grid>

            {/* Progresso e Atividades */}
            <Grid container spacing={3}>
                {/* Progresso de Estudos */}
                {/* <Grid item xs={12} md={6}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Book color="primary" />
                                Progresso de Estudos
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Progresso Geral</Typography>
                                    <Typography variant="body2" color="primary" fontWeight={600}>
                                        {progressoEstudos.toFixed(1)}%
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={progressoEstudos} 
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4,
                                        backgroundColor: 'rgba(25, 118, 210, 0.2)',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#1976D2'
                                        }
                                    }} 
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Chip 
                                    icon={<CheckCircle />} 
                                    label={`${estudosConcluidos} Concluídos`} 
                                    color="success" 
                                    variant="outlined"
                                />
                                <Chip 
                                    icon={<Assignment />} 
                                    label={`${estudosEmAndamento} Em Andamento`} 
                                    color="warning" 
                                    variant="outlined"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid> */}

                {/* Atividades Recentes */}
                <Grid item xs={12} md={6}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TrendingUp color="primary" />
                                Atividades Recentes
                            </Typography>
                            
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
                                            background: 'rgba(25, 118, 210, 0.05)',
                                            border: '1px solid rgba(25, 118, 210, 0.1)'
                                        }}
                                    >
                                        <Avatar 
                                            sx={{ 
                                                bgcolor: 'primary.main',
                                                width: 40,
                                                height: 40
                                            }}
                                        >
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
                                        <Typography variant="caption" color="text.secondary">
                                            {activity.time}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Citação Inspiradora */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Card 
                    elevation={1}
                    sx={{ 
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        border: '1px solid rgba(25, 118, 210, 0.2)'
                    }}
                >
                    <CardContent>
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