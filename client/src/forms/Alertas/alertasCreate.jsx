import {
    ArrowBack as ArrowBackIcon,
    Description as DescriptionIcon,
    Flag as FlagIcon,
    Person as PersonIcon,
    Save as SaveIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    Create,
    Grid,
    Paper,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    Stack,
    TextInput,
    Typography,
    useTheme
} from '@mui/material';
import React, { useState } from 'react';
import {
    SaveButton,
    Toolbar,
    useRedirect
} from 'react-admin';
import { alertasSchema } from '../../validation/schemas';
import { useZodValidation } from '../../validation/useZodValidation';

// Componente de toolbar customizado
const CustomToolbar = () => {
    const redirect = useRedirect();
    
    return (
        <Toolbar>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => redirect('list', 'alertas')}
                >
                    Voltar
                </Button>
                <Box sx={{ flex: 1 }} />
                <SaveButton
                    label="Salvar Alerta"
                    icon={<SaveIcon />}
                    sx={{
                        backgroundColor: '#1976D2',
                        '&:hover': {
                            backgroundColor: '#0D47A1'
                        }
                    }}
                />
            </Box>
        </Toolbar>
    );
};

const AlertasCreate = props => {
    const theme = useTheme();
    const redirect = useRedirect();
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState({});

    // Hook de validação Zod
    const { validate, errors, isValid } = useZodValidation(alertasSchema);

    const onSuccess = (data) => {
        redirect('list', 'alertas');
    };

    const handleSubmit = (data) => {
        const validationResult = validate(data);
        if (validationResult.success) {
            // Dados válidos, prosseguir com o envio
            console.log('Dados válidos:', validationResult.data);
            return data;
        } else {
            console.error('Erros de validação:', validationResult.error);
            return false;
        }
    };

    const handleFormChange = (data) => {
        setFormData(data);
        validate(data);
    };

    return (
        <Create {...props} onSuccess={onSuccess}>
            <SimpleForm onSubmit={handleSubmit} onChange={handleFormChange} toolbar={<CustomToolbar />}>
                <Box sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box 
                            sx={{ 
                                p: 2, 
                                borderRadius: 3, 
                                backgroundColor: theme.palette.error.main + '20',
                                color: theme.palette.error.main,
                                mr: 3
                            }}
                        >
                            <WarningIcon sx={{ fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                                Novo Alerta
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Crie um novo alerta para acompanhar situações importantes
                            </Typography>
                        </Box>
                    </Box>

                    {/* Alertas de validação */}
                    {!isValid && Object.keys(errors).length > 0 && (
                        <Alert 
                            severity="warning" 
                            sx={{ mb: 3 }}
                            action={
                                <Button 
                                    color="inherit" 
                                    size="small"
                                    onClick={() => setShowPreview(!showPreview)}
                                >
                                    {showPreview ? 'Ocultar' : 'Ver'} Detalhes
                                </Button>
                            }
                        >
                            Existem erros de validação no formulário
                        </Alert>
                    )}

                    <Collapse in={showPreview && !isValid}>
                        <Paper sx={{ p: 2, mb: 3, backgroundColor: theme.palette.warning.light + '10' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Erros de Validação:
                            </Typography>
                            <Stack spacing={1}>
                                {Object.entries(errors).map(([field, error]) => (
                                    <Box key={field} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>{field}:</strong> {error}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </Collapse>

                    {/* Informações do Alerta */}
                    <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <WarningIcon color="error" />
                                <Typography variant="h6" sx={{ fontWeight: 600, ml: 1 }}>
                                    Informações do Alerta
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <SelectInput
                                        source="tipo"
                                        label="Tipo de Alerta"
                                        variant="outlined"
                                        fullWidth
                                        choices={[
                                            { id: 'PRESENCA', name: 'Presença' },
                                            { id: 'ESTUDO', name: 'Estudo' },
                                            { id: 'BATISMO', name: 'Batismo' },
                                            { id: 'GERAL', name: 'Geral' }
                                        ]}
                                        helperText="Tipo de alerta que está sendo criado"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <SelectInput
                                        source="prioridade"
                                        label="Prioridade"
                                        variant="outlined"
                                        fullWidth
                                        choices={[
                                            { id: 'BAIXA', name: 'Baixa' },
                                            { id: 'MEDIA', name: 'Média' },
                                            { id: 'ALTA', name: 'Alta' },
                                            { id: 'URGENTE', name: 'Urgente' }
                                        ]}
                                        defaultValue="MEDIA"
                                        helperText="Nível de prioridade do alerta"
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextInput
                                        source="titulo"
                                        label="Título do Alerta"
                                        variant="outlined"
                                        fullWidth
                                        helperText="Título descritivo do alerta"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Pessoa Relacionada */}
                    <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <PersonIcon color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600, ml: 1 }}>
                                    Pessoa Relacionada
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <ReferenceInput 
                                        source="pessoa.id" 
                                        reference="pessoa"
                                        label="Pessoa"
                                        helperText="Selecione a pessoa relacionada ao alerta"
                                    >
                                        <SelectInput 
                                            optionText="nomeCompleto" 
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </ReferenceInput>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Detalhes do Alerta */}
                    <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <DescriptionIcon color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600, ml: 1 }}>
                                    Detalhes do Alerta
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextInput
                                        source="descricao"
                                        label="Descrição"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        helperText="Descrição detalhada do alerta"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <SelectInput
                                        source="status"
                                        label="Status"
                                        variant="outlined"
                                        fullWidth
                                        choices={[
                                            { id: 'ATIVO', name: 'Ativo' },
                                            { id: 'RESOLVIDO', name: 'Resolvido' },
                                            { id: 'ARQUIVADO', name: 'Arquivado' }
                                        ]}
                                        defaultValue="ATIVO"
                                        helperText="Status atual do alerta"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Card de Resumo */}
                    <Card sx={{ mb: 3, backgroundColor: theme.palette.info.light + '10', border: `1px solid ${theme.palette.info.light}` }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <FlagIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                                <Typography variant="h6" sx={{ color: theme.palette.info.main }}>
                                    Resumo do Alerta
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Tipo:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.tipo || 'Não definido'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Prioridade:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.prioridade || 'Não definida'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Título:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.titulo || 'Não definido'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Pessoa:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.pessoa?.nomeCompleto || 'Não selecionada'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </SimpleForm>
        </Create>
    );
};

export default AlertasCreate;

    
