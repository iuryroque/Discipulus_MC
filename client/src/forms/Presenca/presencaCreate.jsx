import {
    Event as EventIcon,
    Note as NoteIcon,
    Person as PersonIcon
} from '@mui/icons-material'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import {
    Create,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextInput
} from 'react-admin'
import { presencaSchema } from '../../validation/schemas'
import { useZodValidation } from '../../validation/useZodValidation'

const PresencaCreate = props => {
    const validate = useZodValidation(presencaSchema);

    return (
        <Create {...props} title="Nova Presença">
            <SimpleForm validate={validate}>
                <Grid container spacing={3}>
                    {/* Informações Principais */}
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
                                    <EventIcon />
                                    Informações da Presença
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <ReferenceInput 
                                            source="pessoa.id" 
                                            reference="pessoa"
                                        >
                                            <SelectInput 
                                                optionText="nomeCompleto" 
                                                variant="outlined"
                                                label="Pessoa"
                                                helperText="Selecione a pessoa"
                                                fullWidth
                                            />
                                        </ReferenceInput>
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <SelectInput 
                                            source="presente" 
                                            label="Status de Presença"
                                            choices={[
                                                { id: 'SIM', name: 'Presente' },
                                                { id: 'NAO', name: 'Ausente' },
                                                { id: 'JUSTIFICADO', name: 'Justificado' }
                                            ]}
                                            variant="outlined"
                                            fullWidth
                                            helperText="Selecione o status de presença"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Observações */}
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
                                    <NoteIcon />
                                    Observações
                                </Typography>
                                
                                <TextInput 
                                    source="observacoes" 
                                    variant="outlined"
                                    label="Observações"
                                    helperText="Adicione observações sobre a presença (opcional)"
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Informações Adicionais */}
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
                                    <PersonIcon />
                                    Informações do Sistema
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Box sx={{ 
                                            p: 2, 
                                            bgcolor: 'info.50', 
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: 'info.200'
                                        }}>
                                            <Typography variant="subtitle2" color="info.main" gutterBottom>
                                                Data de Criação
                                            </Typography>
                                            <Typography variant="body2" color="info.main">
                                                Será preenchido automaticamente
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Box sx={{ 
                                            p: 2, 
                                            bgcolor: 'info.50', 
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: 'info.200'
                                        }}>
                                            <Typography variant="subtitle2" color="info.main" gutterBottom>
                                                Registrado por
                                            </Typography>
                                            <Typography variant="body2" color="info.main">
                                                Usuário atual do sistema
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Box sx={{ 
                                            p: 2, 
                                            bgcolor: 'success.50', 
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: 'success.200'
                                        }}>
                                            <Typography variant="subtitle2" color="success.main" gutterBottom>
                                                Status do Registro
                                            </Typography>
                                            <Typography variant="body2" color="success.main">
                                                Ativo
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </SimpleForm>
        </Create>
    )
}

export default PresencaCreate

    
