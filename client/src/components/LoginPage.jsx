import {
    Book,
    CheckCircle,
    Event,
    Notifications,
    People,
    School,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login({ username, password });
            notify('Login realizado com sucesso!', { type: 'success' });
        } catch (error) {
            setError('Usuário ou senha incorretos. Tente novamente.');
            notify('Erro na autenticação', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: People, title: 'Gestão de Membros', description: 'Cadastro e acompanhamento de pessoas' },
        { icon: Event, title: 'Controle de Presença', description: 'Registro de presença em cultos' },
        { icon: School, title: 'Acompanhamento de Estudos', description: 'Monitoramento do progresso espiritual' },
        { icon: Book, title: 'Currículo de Estudos', description: 'Organização de lições e materiais' },
        { icon: CheckCircle, title: 'Lições Concluídas', description: 'Controle de progresso individual' },
        { icon: Notifications, title: 'Sistema de Alertas', description: 'Notificações e lembretes importantes' }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#1976D2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    maxWidth: 1200,
                    width: '100%',
                    gap: 4,
                    flexDirection: { xs: 'column', lg: 'row' }
                }}
            >
                {/* Card de Login */}
                <Card
                    elevation={8}
                    sx={{
                        width: { xs: '100%', lg: 400 },
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        {/* Header */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    backgroundColor: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px',
                                    boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)'
                                }}
                            >
                                <img src={'/favicon.png'} alt="Ícone de pessoas" style={{ width: 48, height: 48 }} />
                            </Box>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
                                Discipulus
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                Sistema de Gestão de Discipulado
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                        </Box>

                        {/* Formulário */}
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                required
                                sx={{ mb: 2 }}
                                InputProps={{
                                    sx: { borderRadius: 2 }
                                }}
                            />
                            
                            <TextField
                                fullWidth
                                label="Senha"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                required
                                sx={{ mb: 3 }}
                                InputProps={{
                                    sx: { borderRadius: 2 },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {error && (
                                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    backgroundColor: '#1976D2',
                                    '&:hover': {
                                        backgroundColor: '#0D47A1'
                                    }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Entrar no Sistema'
                                )}
                            </Button>
                        </form>

                        {/* Footer */}
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="caption" color="text.secondary">
                                © 2024 Discipulus - Gestão de Discipulado
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Card de Features */}
                <Paper
                    elevation={8}
                    sx={{
                        flex: 1,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        p: 4,
                        display: { xs: 'none', lg: 'block' }
                    }}
                >
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50', mb: 3 }}>
                        Recursos do Sistema
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                        {features.map((feature, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    background: 'rgba(25, 118, 210, 0.05)',
                                    border: '1px solid rgba(25, 118, 210, 0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'rgba(25, 118, 210, 0.1)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: '50%',
                                        backgroundColor: '#1976D2',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}
                                >
                                    <feature.icon sx={{ fontSize: 24, color: 'white' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            "Ide, portanto, e fazei discípulos de todas as nações..."
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Mateus 28:19
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default LoginPage; 