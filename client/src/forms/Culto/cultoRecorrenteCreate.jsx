import {
    ArrowBack,
    Description,
    Event,
    Person,
    Repeat,
    Save,
    Schedule
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
import React, { useState } from 'react';
import {
    BooleanInput,
    Create,
    DateInput,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    TimeInput,
    Toolbar,
    useNotify,
    useRedirect
} from 'react-admin';
import { cultoRecorrenteSchema } from '../../validation/schemas';
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
                    onClick={() => redirect('list', 'culto-recorrente')}
                >
                    Voltar
                </Button>
                <Box sx={{ flex: 1 }} />
                <SaveButton
                    label="Salvar Configuração"
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




const CultoRecorrenteCreate = (props) => {
    const [formErrors, setFormErrors] = useState({});
    const redirect = useRedirect();
    const notify = useNotify();
    const validate = useZodValidation(cultoRecorrenteSchema);
    
    const handleValidate = (values) => {
        console.log('Valores recebidos pelo validate:', JSON.stringify(values, null, 2));
        console.log('Valor da hora:', values.hora, 'Tipo:', typeof values.hora);
        
        const result = validate(values);
        setFormErrors(result);
        
        if (Object.keys(result).length > 0) {
            console.log('Erros de validação:', result);
        } else {
            console.log('Validação passou com sucesso!');
        }
        
        return result;
    };

    return (
        <Create {...props} title="Nova Configuração de Culto Recorrente">
            <SimpleForm 
                validate={handleValidate}
                toolbar={<CustomToolbar />}
            >
                {/* ALERTA DE ERROS DE VALIDAÇÃO */}
                {Object.keys(formErrors || {}).length > 0 && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        <strong>O formulário não é válido:</strong>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {Object.entries(formErrors).map(([field, msg]) => (
                                <li key={field}><b>{field}:</b> {msg}</li>
                            ))}
                        </ul>
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* Informações Básicas */}
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    color: 'primary.main', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    mb: 3 
                                }}>
                                    <Event />
                                    Informações Básicas
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextInput
                                            source="titulo"
                                            label="Título do Culto"
                                            variant="outlined"
                                            fullWidth
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
                    </Grid>

                    {/* Configuração de Recorrência */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    color: 'primary.main', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    mb: 3 
                                }}>
                                    <Repeat />
                                    Recorrência
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <SelectInput
                                            source="diaSemana"
                                            label="Dia da Semana"
                                            choices={[
                                                { id: 'DOMINGO', name: 'Domingo' },
                                                { id: 'SEGUNDA', name: 'Segunda-feira' },
                                                { id: 'TERCA', name: 'Terça-feira' },
                                                { id: 'QUARTA', name: 'Quarta-feira' },
                                                { id: 'QUINTA', name: 'Quinta-feira' },
                                                { id: 'SEXTA', name: 'Sexta-feira' },
                                                { id: 'SABADO', name: 'Sábado' }
                                            ]}
                                            variant="outlined"
                                            fullWidth
                                            helperText="Selecione o dia da semana"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <TimeInput
                                            source="hora"
                                            label="Hora do Culto"
                                            variant="outlined"
                                            fullWidth
                                            helperText="Selecione a hora do culto"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <TextInput
                                            source="local"
                                            label="Local"
                                            variant="outlined"
                                            fullWidth
                                            helperText="Ex: Templo Principal, Salão Social"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Período de Vigência */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    color: 'primary.main', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    mb: 3 
                                }}>
                                    <Schedule />
                                    Período de Vigência
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <DateInput
                                            source="dataInicio"
                                            label="Data de Início"
                                            variant="outlined"
                                            fullWidth
                                            helperText="Data a partir da qual os cultos serão gerados"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <DateInput
                                            source="dataFim"
                                            label="Data de Fim (Opcional)"
                                            variant="outlined"
                                            fullWidth
                                            helperText="Data até a qual os cultos serão gerados"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Ministração */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    color: 'primary.main', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    mb: 3 
                                }}>
                                    <Person />
                                    Ministração
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextInput
                                            source="pregador"
                                            label="Pregador/Ministeriante"
                                            variant="outlined"
                                            fullWidth
                                            helperText="Nome do pregador ou ministrante (opcional)"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <SelectInput
                                            source="status"
                                            label="Status Padrão"
                                            variant="outlined"
                                            fullWidth
                                            choices={[
                                                { id: 'Agendado', name: 'Agendado' },
                                                { id: 'Realizado', name: 'Realizado' },
                                                { id: 'Cancelado', name: 'Cancelado' }
                                            ]}
                                            defaultValue="Agendado"
                                            helperText="Status padrão dos cultos gerados"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <BooleanInput
                                            source="ativo"
                                            label="Configuração Ativa"
                                            helperText="Marque para ativar esta configuração"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Observações */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    color: 'primary.main', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    mb: 3 
                                }}>
                                    <Description />
                                    Observações Adicionais
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextInput
                                            source="observacoes"
                                            label="Observações"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            helperText="Observações adicionais sobre a configuração"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </SimpleForm>
        </Create>
    );
};

export default CultoRecorrenteCreate; 