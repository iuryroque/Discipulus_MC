import {
    ArrowBack as ArrowBackIcon,
    Description as DescriptionIcon,
    Person as PersonIcon,
    Save as SaveIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    useTheme
} from '@mui/material';
import {
    Edit,
    ReferenceInput,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    useRedirect
} from 'react-admin';
import { ZodError } from 'zod';
import AuditInfo from '../../components/AuditInfo';
import { alertasSchema } from '../../validation/schemas';

/**
 * --- LÓGICA DE VALIDAÇÃO ZOD ---
 * Integra o schema do Zod com o sistema de validação do React Admin.
 */
const validateAlertas = (values) => {
    console.log('Erro de validação11:', values);
    try {
        alertasSchema.parse(values);
        return {}; // Retorna um objeto vazio se a validação passar
    } catch (error) {
        if (error instanceof ZodError) {
            // Transforma os erros do Zod para o formato que o React Admin entende
            return error.errors.reduce((acc, curr) => {
                acc[curr.path.join('.')] = curr.message;
                return acc;
            }, {});
        }
        return { _error: 'Erro de validação desconhecido' };
    }
};

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
                    label="Salvar Alterações"
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

// Título da página de edição para exibir o título do alerta
import PropTypes from 'prop-types';

const AlertaTitle = ({ record }) => {
    return <span>Editando Alerta: {record ? `"${record.titulo}"` : ''}</span>;
};


const AlertasEdit = props => {
    const theme = useTheme();

    return (
        <Edit {...props} title={<AlertaTitle />}>
            <SimpleForm validate={validateAlertas} toolbar={<CustomToolbar />}>
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
                                Editar Alerta
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Modifique as informações do alerta conforme necessário.
                            </Typography>
                        </Box>
                    </Box>

                    {/* Informações do Alerta */}
                    <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                {/* <WarningIcon color="primary" /> */}
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
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextInput
                                        source="titulo"
                                        label="Título do Alerta"
                                        variant="outlined"
                                        fullWidth
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
                                    Detalhes e Status
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
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    
                    {/* Informações de Auditoria */}
                    <AuditInfo />

                </Box>
            </SimpleForm>
        </Edit>
    );
};

AlertaTitle.propTypes = {
    record: PropTypes.object
};
export default AlertasEdit;