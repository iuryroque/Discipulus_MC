import {
    Description,
    Event,
    LocationOn,
    Person,
    Save
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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

const CustomToolbar = () => {
    const redirect = useRedirect();
    const theme = useTheme();
    return (
        <Toolbar sx={{ px: 0, bgcolor: 'transparent' }}>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Button variant="outlined" onClick={() => redirect('list', 'culto')}>
                    Voltar
                </Button>
                <Box sx={{ flex: 1 }} />
                <SaveButton
                    label="Salvar Culto"
                    icon={<Save />}
                    sx={{
                        bgcolor: theme.palette.primary.main,
                        '&:hover': { bgcolor: theme.palette.primary.dark },
                    }}
                />
            </Box>
        </Toolbar>
    );
};

const validateCulto = (values) => {
    const errors = {};
    if (!values.titulo) errors.titulo = 'Obrigatório';
    else if (values.titulo.length < 3) errors.titulo = 'Mínimo 3 caracteres';
    else if (values.titulo.length > 100) errors.titulo = 'Máximo 100 caracteres';
    if (!values.local) errors.local = 'Obrigatório';
    if (!values.dataHora) errors.dataHora = 'Obrigatório';
    if (!values.pregador) errors.pregador = 'Obrigatório';
    if (values.descricao?.length > 500) errors.descricao = 'Máximo 500 caracteres';
    if (values.observacoes?.length > 1000) errors.observacoes = 'Máximo 1000 caracteres';
    return errors;
};

const SectionCard = ({ icon: Icon, title, children, mb = 3 }) => (
    <Card elevation={1} sx={{ mb }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <Icon color="primary" fontSize="small" />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {title}
                </Typography>
            </Box>
            {children}
        </CardContent>
    </Card>
);

const twoCol = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gap: 2,
};

const CultoCreate = (props) => {
    const redirect = useRedirect();
    return (
        <Create {...props} mutationOptions={{ onSuccess: () => redirect('list', 'culto') }}>
            <SimpleForm validate={validateCulto} toolbar={<CustomToolbar />}>
                <Box sx={{ p: { xs: 1, sm: 3 }, width: '100%' }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Novo Culto
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Preencha as informações para criar um novo culto
                        </Typography>
                    </Box>

                    <SectionCard icon={Event} title="Informações Básicas">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextInput
                                source="titulo"
                                label="Título do Culto"
                                variant="outlined"
                                fullWidth
                                validate={required()}
                                helperText="Ex: Culto de Domingo, Estudo Bíblico, etc."
                            />
                            <TextInput
                                source="descricao"
                                label="Descrição"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                helperText="Tema ou objetivo do culto"
                            />
                        </Box>
                    </SectionCard>

                    <SectionCard icon={LocationOn} title="Local e Horário">
                        <Box sx={twoCol}>
                            <TextInput
                                source="local"
                                label="Local"
                                variant="outlined"
                                fullWidth
                                validate={required()}
                                helperText="Ex: Templo Principal, Salão Social, etc."
                            />
                            <DateTimeInput
                                source="dataHora"
                                label="Data e Hora"
                                variant="outlined"
                                fullWidth
                                validate={required()}
                                helperText="Data e hora do culto"
                            />
                        </Box>
                    </SectionCard>

                    <SectionCard icon={Person} title="Ministração">
                        <Box sx={twoCol}>
                            <TextInput
                                source="pregador"
                                label="Pregador / Ministeriante"
                                variant="outlined"
                                fullWidth
                                validate={required()}
                                helperText="Nome do pregador ou ministrante"
                            />
                            <SelectInput
                                source="status"
                                label="Status"
                                variant="outlined"
                                fullWidth
                                choices={[
                                    { id: 'Agendado', name: 'Agendado' },
                                    { id: 'Realizado', name: 'Realizado' },
                                    { id: 'Cancelado', name: 'Cancelado' },
                                ]}
                                defaultValue="Agendado"
                                helperText="Status atual do culto"
                            />
                        </Box>
                    </SectionCard>

                    <SectionCard icon={Description} title="Observações" mb={0}>
                        <TextInput
                            source="observacoes"
                            label="Observações"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            helperText="Informações adicionais ou instruções especiais"
                        />
                    </SectionCard>
                </Box>
            </SimpleForm>
        </Create>
    );
};

export default CultoCreate;
