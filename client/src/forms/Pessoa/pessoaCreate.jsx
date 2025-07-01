import {
    WaterDrop as BaptismIcon,
    Email as EmailIcon,
    Info as InfoIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import React from 'react';
import {
    Create,
    DateInput,
    SelectInput,
    SimpleForm,
    TextInput
} from 'react-admin';
import { usePessoaEnumOptions } from '../../hooks/useEnumOptions';
import { pessoaCondicionalSchema } from '../../validation/schemas';
import { useZodValidation } from '../../validation/useZodValidation';

const PessoaCreate = props => {
    const validate = useZodValidation(pessoaCondicionalSchema);
    const { statusOptions, tipoOptions, statusBatismoOptions, loading, error } = usePessoaEnumOptions();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        console.error('Erro ao carregar opções dos enums:', error);
    }

    return (
        <Create {...props} title="Nova Pessoa">
            <SimpleForm validate={validate}>
                <Grid container spacing={3}>
                    {/* Informações Pessoais */}
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
                                    <PersonIcon />
                                    Informações Pessoais
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextInput 
                                            source="nomeCompleto" 
                                            variant="outlined"
                                            label="Nome Completo"
                                            helperText="Digite o nome completo da pessoa"
                                            fullWidth
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <DateInput 
                                            source="dataNascimento" 
                                            variant="outlined"
                                            label="Data de Nascimento"
                                            helperText="Data de nascimento (opcional)"
                                            fullWidth
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <TextInput 
                                            source="telefone" 
                                            variant="outlined"
                                            label="Telefone"
                                            helperText="Digite o número de telefone"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Status e Tipo */}
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
                                    <InfoIcon />
                                    Status e Tipo
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <SelectInput 
                                            source="status" 
                                            label="Status"
                                            choices={statusOptions}
                                            variant="outlined"
                                            fullWidth
                                            helperText="Selecione o status da pessoa"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <SelectInput 
                                            source="tipo" 
                                            label="Tipo"
                                            choices={tipoOptions}
                                            variant="outlined"
                                            fullWidth
                                            helperText="Selecione o tipo da pessoa (email obrigatório para membros)"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Informações de Contato */}
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
                                    <EmailIcon />
                                    Informações de Contato
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextInput 
                                            source="email" 
                                            variant="outlined"
                                            label="Email"
                                            helperText="Digite o endereço de email (obrigatório para membros)"
                                            fullWidth
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <TextInput 
                                            source="endereco" 
                                            variant="outlined"
                                            label="Endereço"
                                            helperText="Digite o endereço completo (opcional)"
                                            multiline
                                            rows={3}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Informações de Batismo */}
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
                                    <BaptismIcon />
                                    Informações de Batismo
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <SelectInput 
                                            source="statusBatismo" 
                                            label="Status do Batismo"
                                            choices={statusBatismoOptions}
                                            variant="outlined"
                                            fullWidth
                                            helperText="Selecione o status do batismo"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <DateInput 
                                            source="dataInteresseBatismo" 
                                            variant="outlined"
                                            label="Data de Interesse no Batismo"
                                            helperText="Data em que demonstrou interesse (opcional)"
                                            fullWidth
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <DateInput 
                                            source="dataBatismo" 
                                            variant="outlined"
                                            label="Data do Batismo"
                                            helperText="Data em que foi batizado (opcional)"
                                            fullWidth
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
                                    <InfoIcon />
                                    Observações
                                </Typography>
                                
                                <TextInput 
                                    source="observacoes" 
                                    variant="outlined"
                                    label="Observações"
                                    helperText="Informações adicionais sobre a pessoa (opcional)"
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </SimpleForm>
        </Create>
    );
};

export default PessoaCreate;

    
