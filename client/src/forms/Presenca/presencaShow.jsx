import {
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Event as EventIcon,
    Note as NoteIcon,
    Person as PersonIcon
} from '@mui/icons-material'
import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material'
import React from 'react'
import {
    NumberField,
    ReferenceField,
    TextField
} from 'react-admin'
import AuditShow from '../../components/AuditShow'

const PresencaShow = props => {
    return (
        <AuditShow {...props} showAuditSection={true} auditVariant="default">
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
                                mb: 2 
                            }}>
                                <EventIcon />
                                Informações da Presença
                            </Typography>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                            ID do Registro
                                        </Typography>
                                        <NumberField source="id" variant="outlined" />
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                            Status de Presença
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <TextField 
                                                source="presente" 
                                                variant="outlined"
                                                render={record => (
                                                    <Chip
                                                        label={record?.presente === 'SIM' ? 'Presente' : 'Ausente'}
                                                        color={record?.presente === 'SIM' ? 'success' : 'error'}
                                                        icon={record?.presente === 'SIM' ? <CheckCircleIcon /> : <CancelIcon />}
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </Box>
                                    </Box>
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
                                mb: 2 
                            }}>
                                <NoteIcon />
                                Observações
                            </Typography>
                            
                            <TextField 
                                source="observacoes" 
                                variant="outlined"
                                render={record => (
                                    <Typography variant="body2" sx={{ 
                                        p: 2, 
                                        bgcolor: 'grey.50', 
                                        borderRadius: 1,
                                        minHeight: '60px',
                                        border: '1px solid',
                                        borderColor: 'grey.200'
                                    }}>
                                        {record?.observacoes || 'Nenhuma observação registrada'}
                                    </Typography>
                                )}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Informações da Pessoa */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ 
                                color: 'primary.main', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                mb: 2 
                            }}>
                                <PersonIcon />
                                Informações da Pessoa
                            </Typography>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                            Nome Completo
                                        </Typography>
                                        <ReferenceField source="pessoa.id" reference="pessoa">
                                            <TextField source="nomeCompleto" />
                                        </ReferenceField>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                            Telefone
                                        </Typography>
                                        <ReferenceField source="pessoa.id" reference="pessoa">
                                            <TextField source="telefone" />
                                        </ReferenceField>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                            Email
                                        </Typography>
                                        <ReferenceField source="pessoa.id" reference="pessoa">
                                            <TextField source="email" />
                                        </ReferenceField>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                            Status
                                        </Typography>
                                        <ReferenceField source="pessoa.id" reference="pessoa">
                                            <TextField 
                                                source="status"
                                                render={record => (
                                                    <Chip
                                                        label={record?.status || 'N/A'}
                                                        color={record?.status === 'ATIVO' ? 'success' : 'default'}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </ReferenceField>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AuditShow>
    )
}

export default PresencaShow 