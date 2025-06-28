import {
    WaterDrop as BaptismIcon,
    Email as EmailIcon,
    Info as InfoIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from '@mui/material';
import React from 'react';
import {
    DateField,
    Show,
    SimpleShowLayout,
    TextField
} from 'react-admin';

const PessoaShow = props => {
    return (
        <Show {...props}>
            <SimpleShowLayout>
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
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Nome Completo
                                        </Typography>
                                        <TextField source="nomeCompleto" />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Data de Nascimento
                                        </Typography>
                                        <DateField source="dataNascimento" showTime={false} />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Telefone
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PhoneIcon fontSize="small" color="action" />
                                            <TextField source="telefone" />
                                        </Box>
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
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Status
                                        </Typography>
                                        <TextField source="status" />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Tipo
                                        </Typography>
                                        <TextField source="tipo" />
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
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Email
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EmailIcon fontSize="small" color="action" />
                                            <TextField source="email" />
                                        </Box>
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Endereço
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                            <LocationIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                            <TextField source="endereco" />
                                        </Box>
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
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Status do Batismo
                                        </Typography>
                                        <TextField source="statusBatismo" />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Data de Interesse
                                        </Typography>
                                        <DateField source="dataInteresseBatismo" showTime={false} />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Data do Batismo
                                        </Typography>
                                        <DateField source="dataBatismo" showTime={false} />
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
                                
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Observações
                                </Typography>
                                <TextField source="observacoes" />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </SimpleShowLayout>
        </Show>
    );
};

export default PessoaShow; 
