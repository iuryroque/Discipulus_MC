import {
    ArrowBack,
    Person,
    Save,
    School,
    TrendingUp
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    Grid,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import {
    Create,
    ReferenceInput,
    required,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    useRedirect
} from 'react-admin';
import { acompanhamentoEstudoSchema } from '../../validation/schemas';
import { useZodValidation } from '../../validation/useZodValidation';

// Componente de toolbar customizado
const CustomToolbar = () => {
    const redirect = useRedirect();
    
    return (
        <Toolbar>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => redirect('list', 'acompanhamentoEstudo')}
                >
                    Voltar
                </Button>
                <Box sx={{ flex: 1 }} />
                <SaveButton
                    label="Salvar Acompanhamento"
                    icon={<Save />}
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

const AcompanhamentoEstudoCreate = (props) => {
    const redirect = useRedirect();
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState({});

    // Hook de validação Zod
    const { validate, errors, isValid } = useZodValidation(acompanhamentoEstudoSchema);

    const onSuccess = (data) => {
        redirect('list', 'acompanhamentoEstudo');
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
        <Create {...props}>
            <SimpleForm 
                onSubmit={handleSubmit}
                onChange={handleFormChange}
                onSuccess={onSuccess}
                toolbar={<CustomToolbar />}
                sx={{
                    '& .RaSimpleFormForm': {
                        padding: 0
                    }
                }}
            >
                <Box sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
                            Novo Acompanhamento de Estudo
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Crie um novo acompanhamento para monitorar o progresso dos estudos
                        </Typography>
                    </Box>

                    {/* Alertas de validação */}
                    {!isValid && Object.keys(errors || {}).length > 0 && (
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
                        <Paper sx={{ p: 2, mb: 3, backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Erros de Validação:
                            </Typography>
                            <Stack spacing={1}>
                                {Object.entries(errors || {}).map(([field, error]) => (
                                    <Box key={field} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>{field}:</strong> {error}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </Collapse>

                    {/* Informações do Discípulo */}
                    <Card elevation={2} sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <Person color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Informações do Discípulo
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <ReferenceInput 
                                        source="pessoa.id" 
                                        reference="pessoa"
                                        label="Discípulo"
                                        helperText="Selecione o discípulo para acompanhamento"
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

                    {/* Status e Datas */}
                    <Card elevation={2} sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <TrendingUp color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Status e Progresso
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <SelectInput
                                        source="nivelEstudo"
                                        label="Nível de Estudo"
                                        variant="outlined"
                                        fullWidth
                                        validate={required()}
                                        choices={[
                                            { id: 'INICIANTE', name: 'Iniciante' },
                                            { id: 'INTERMEDIARIO', name: 'Intermediário' },
                                            { id: 'AVANCADO', name: 'Avançado' }
                                        ]}
                                        helperText="Nível atual do discípulo"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextInput
                                        source="ultimaLicao"
                                        label="Última Lição"
                                        variant="outlined"
                                        fullWidth
                                        helperText="Última lição estudada pelo discípulo"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Observações */}
                    <Card elevation={2}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <School color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Observações
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextInput
                                        source="observacoes"
                                        label="Observações"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        helperText="Observações sobre o progresso do discípulo"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Card de Resumo */}
                    <Card sx={{ mb: 3, backgroundColor: '#e8f5e8', border: '1px solid #4caf50' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                                <Typography variant="h6" sx={{ color: '#4caf50' }}>
                                    Resumo do Acompanhamento
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Discípulo:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.pessoa?.nomeCompleto || 'Não selecionado'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Nível:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.nivelEstudo || 'Não definido'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Última Lição:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.ultimaLicao || 'Não definida'}
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

export default AcompanhamentoEstudoCreate;

    
