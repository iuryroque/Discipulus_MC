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
    Create,
    Loading,
    ReferenceInput,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    useGetIdentity, // Importado para buscar o usuário logado
    useRedirect
} from 'react-admin';
import { ZodError } from 'zod'; // Importado para o tratamento de erros do Zod
import { alertasSchema } from '../../validation/schemas';

/**
 * --- LÓGICA DE VALIDAÇÃO REATORADA ---
 * Esta função integra o schema do Zod com o sistema de validação do React Admin.
 * Ela é mais simples e robusta que o hook customizado anterior.
 */
const validateAlertas = (values) => {
    try {
        alertasSchema.parse(values);
        return {}; // Retorna um objeto vazio se a validação for bem-sucedida
    } catch (error) {
        if (error instanceof ZodError) {
            // Transforma os erros do Zod para o formato que o React Admin entende
            return error.errors.reduce((acc, curr) => {
                // A chave do erro é o nome do campo (ex: 'titulo', 'pessoa.id')
                acc[curr.path.join('.')] = curr.message;
                return acc;
            }, {});
        }
        return { _error: 'Ocorreu um erro de validação inesperado.' };
    }
};

// Componente de toolbar customizado (sem alterações)
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

    // --- NOVO: Hook para obter a identidade do usuário logado ---
    // Essencial para associar o alerta ao usuário que o está criando.
    const { identity, isLoading, error } = useGetIdentity();

    // --- CORREÇÃO PRINCIPAL: Trata o estado de carregamento ---
    // Isso impede a renderização do formulário antes que a identidade do usuário
    // seja conhecida, evitando o erro de "undefined" ou "null".
    if (isLoading) return <Loading />;
    if (error) return <p>Não foi possível carregar os dados do usuário.</p>;

    const onSuccess = () => {
        redirect('list', 'alertas');
    };

    // --- NOVO: Transforma os dados antes de salvar ---
    // Adiciona o ID do usuário logado como 'responsavel' antes de enviar para a API.
    const transform = data => ({
        ...data,
        responsavel: { id: identity.id }
    });

    return (
        <Create {...props} transform={transform} onSuccess={onSuccess}>
            {/* --- ALTERAÇÃO: A validação agora é uma prop do SimpleForm --- */}
            <SimpleForm validate={validateAlertas} toolbar={<CustomToolbar />}>
                <Box sx={{ p: 3 }}>
                    {/* Header (sem alterações) */}
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

                    {/*
                      --- REMOVIDO: A lógica customizada de exibição de erros foi removida. ---
                      O React Admin agora exibe as mensagens de erro diretamente nos campos do formulário.
                    */}

                    {/* Informações do Alerta (sem alterações) */}
                    <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                {/* <WarningIcon color="error" /> */}
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

                    {/* Pessoa Relacionada (sem alterações) */}
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

                    {/* Detalhes do Alerta (sem alterações) */}
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
                    
                    {/* --- REMOVIDO: O card de resumo foi removido para simplificar. --- */}
                    {/* Ele dependia do estado manual `formData`, que não é mais necessário. */}
                </Box>
            </SimpleForm>
        </Create>
    );
};

export default AlertasCreate;