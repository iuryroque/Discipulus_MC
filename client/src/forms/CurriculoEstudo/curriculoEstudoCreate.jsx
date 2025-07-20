import {
    ArrowBack,
    Book,
    Description,
    Flag,
    Grade,
    Save
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
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    required,
    useRedirect
} from 'react-admin';
import { curriculoEstudoSchema } from '../../validation/schemas';
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
                    onClick={() => redirect('list', 'curriculoEstudo')}
                >
                    Voltar
                </Button>
                <Box sx={{ flex: 1 }} />
                <SaveButton
                    label="Salvar Currículo"
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

const CurriculoEstudoCreate = (props) => {
    const redirect = useRedirect();
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState({});

    // Hook de validação Zod
    const { validate, errors, isValid } = useZodValidation(curriculoEstudoSchema);

    const onSuccess = (data) => {
        redirect('list', 'curriculoEstudo');
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
                            Novo Currículo de Estudo
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Crie um novo currículo para orientar os estudos dos discípulos
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

                    {/* Informações Básicas */}
                    <Card elevation={2} sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <Book color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Informações Básicas
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextInput
                                        source="nome"
                                        label="Nome do Currículo"
                                        variant="outlined"
                                        fullWidth
                                        validate={required()}
                                        helperText="Ex: Currículo Básico de Discipulado, Estudos Avançados, etc."
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextInput
                                        source="descricao"
                                        label="Descrição"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        validate={required()}
                                        helperText="Descreva detalhadamente o conteúdo e propósito deste currículo"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Configurações do Currículo */}
                    <Card elevation={2} sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <Grade color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Configurações
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <SelectInput
                                        source="nivel"
                                        label="Nível"
                                        variant="outlined"
                                        fullWidth
                                        validate={required()}
                                        choices={[
                                            { id: 'Básico', name: 'Básico' },
                                            { id: 'Intermediário', name: 'Intermediário' },
                                            { id: 'Avançado', name: 'Avançado' }
                                        ]}
                                        helperText="Nível de dificuldade do currículo"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextInput
                                        source="duracao"
                                        label="Duração"
                                        variant="outlined"
                                        fullWidth
                                        helperText="Ex: 6 meses, 1 ano, etc."
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <SelectInput
                                        source="status"
                                        label="Status"
                                        variant="outlined"
                                        fullWidth
                                        validate={required()}
                                        choices={[
                                            { id: 'ATIVO', name: 'Ativo' },
                                            { id: 'INATIVO', name: 'Inativo' },
                                            { id: 'EM_DESENVOLVIMENTO', name: 'Em Desenvolvimento' }
                                        ]}
                                        helperText="Status atual do currículo"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Detalhes Adicionais */}
                    <Card elevation={2} sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <Description color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Detalhes Adicionais
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextInput
                                        source="objetivos"
                                        label="Objetivos de Aprendizagem"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        helperText="Liste os objetivos principais que os alunos devem alcançar"
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextInput
                                        source="observacoes"
                                        label="Observações"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        helperText="Observações adicionais sobre o currículo"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Card de Resumo */}
                    <Card sx={{ mb: 3, backgroundColor: '#e8f5e8', border: '1px solid #4caf50' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Flag sx={{ color: '#4caf50', mr: 1 }} />
                                <Typography variant="h6" sx={{ color: '#4caf50' }}>
                                    Resumo do Currículo
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Nome:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.nome || 'Não definido'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Nível:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.nivel || 'Não definido'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Descrição:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.descricao || 'Não definida'}
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

export default CurriculoEstudoCreate;

    
