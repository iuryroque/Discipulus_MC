import {
    ArrowBack,
    Description,
    Event,
    LocationOn,
    Person,
    Save
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography
} from '@mui/material';
import React from 'react';
import {
    Create,
    DateTimeInput,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    required,
    useRedirect
} from 'react-admin';

// Componente de toolbar customizado
const CustomToolbar = () => {
    const redirect = useRedirect();
    
    return (
        <Toolbar>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => redirect('list', 'culto')}
                >
                    Voltar
                </Button>
                <Box sx={{ flex: 1 }} />
                <SaveButton
                    label="Salvar Culto"
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

// Componente de validação customizada
const validateCulto = (values) => {
    const errors = {};
    
    if (!values.titulo) {
        errors.titulo = 'O título é obrigatório';
    } else if (values.titulo.length < 3) {
        errors.titulo = 'O título deve ter pelo menos 3 caracteres';
    } else if (values.titulo.length > 100) {
        errors.titulo = 'O título deve ter no máximo 100 caracteres';
    }
    
    if (!values.local) {
        errors.local = 'O local é obrigatório';
    }
    
    if (!values.dataHora) {
        errors.dataHora = 'A data e hora são obrigatórias';
    } else {
        const selectedDate = new Date(values.dataHora);
        const now = new Date();
        if (selectedDate < now) {
            errors.dataHora = 'A data e hora não podem ser no passado';
        }
    }
    
    if (!values.pregador) {
        errors.pregador = 'O pregador é obrigatório';
    }
    
    if (values.descricao && values.descricao.length > 500) {
        errors.descricao = 'A descrição deve ter no máximo 500 caracteres';
    }
    
    if (values.observacoes && values.observacoes.length > 1000) {
        errors.observacoes = 'As observações devem ter no máximo 1000 caracteres';
    }
    
    return errors;
};

const CultoCreate = (props) => {
    const redirect = useRedirect();

    const onSuccess = (data) => {
        redirect('list', 'culto');
    };

    return (
        <Create {...props}>
            <SimpleForm 
                validate={validateCulto}
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
                            Novo Culto
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Preencha as informações para criar um novo culto
                        </Typography>
                    </Box>

                    {/* Informações Básicas */}
                    <Card elevation={2} sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <Event color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Informações Básicas
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextInput
                                        source="titulo"
                                        label="Título do Culto"
                                        variant="outlined"
                                        fullWidth
                                        validate={required()}
                                        helperText="Ex: Culto de Domingo, Estudo Bíblico, etc."
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextInput
                                        source="descricao"
                                        label="Descrição"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        helperText="Descreva brevemente o tema ou objetivo do culto"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Local e Horário */}
                    <Card elevation={2} sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <LocationOn color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Local e Horário
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextInput
                                        source="local"
                                        label="Local"
                                        variant="outlined"
                                        fullWidth
                                        validate={required()}
                                        helperText="Ex: Templo Principal, Salão Social, etc."
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <DateTimeInput
                                        source="dataHora"
                                        label="Data e Hora"
                                        variant="outlined"
                                        fullWidth
                                        validate={required()}
                                        helperText="Selecione a data e hora do culto"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Ministração */}
                    <Card elevation={2} sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <Person color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Ministração
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextInput
                                        source="pregador"
                                        label="Pregador/Ministeriante"
                                        variant="outlined"
                                        fullWidth
                                        validate={required()}
                                        helperText="Nome do pregador ou ministrante"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <SelectInput
                                        source="status"
                                        label="Status"
                                        variant="outlined"
                                        fullWidth
                                        choices={[
                                            { id: 'Agendado', name: 'Agendado' },
                                            { id: 'Realizado', name: 'Realizado' },
                                            { id: 'Cancelado', name: 'Cancelado' }
                                        ]}
                                        defaultValue="Agendado"
                                        helperText="Status atual do culto"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Observações Adicionais */}
                    <Card elevation={2}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <Description color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Observações Adicionais
                                </Typography>
                            </Box>
                            
                            <TextInput
                                source="observacoes"
                                label="Observações"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                helperText="Informações adicionais, instruções especiais ou observações importantes"
                            />
                        </CardContent>
                    </Card>

                    {/* Dicas */}
                    <Alert severity="info" sx={{ mt: 3 }}>
                        <Typography variant="body2">
                            <strong>Dica:</strong> Preencha todos os campos obrigatórios para criar um culto completo. 
                            As observações são opcionais mas podem ser úteis para informações adicionais.
                        </Typography>
                    </Alert>
                </Box>
            </SimpleForm>
        </Create>
    );
};

export default CultoCreate;

    
