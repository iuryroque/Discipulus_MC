import {
    WaterDrop as BaptismIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { Box, CircularProgress, Divider, Typography } from '@mui/material';
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

const Section = ({ icon: Icon, title }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 1 }}>
        <Icon color="primary" fontSize="small" />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {title}
        </Typography>
    </Box>
);

const PessoaCreate = props => {
    const validate = useZodValidation(pessoaCondicionalSchema);
    const { statusOptions, tipoOptions, statusBatismoOptions, loading } = usePessoaEnumOptions();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Create {...props} title="Nova Pessoa">
            <SimpleForm validate={validate}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>

                    {/* Card 1 — Dados Pessoais */}
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 3 }}>
                        <Section icon={PersonIcon} title="Dados Pessoais" />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextInput
                                source="nomeCompleto"
                                label="Nome Completo"
                                variant="outlined"
                                helperText="Digite o nome completo da pessoa"
                                fullWidth
                            />
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                <Box>
                                    <DateInput
                                        source="dataNascimento"
                                        label="Data de Nascimento"
                                        variant="outlined"
                                        helperText="Opcional"
                                    />
                                </Box>
                                <Box>
                                    <TextInput
                                        source="telefone"
                                        label="Telefone"
                                        variant="outlined"
                                        helperText="Digite o número de telefone"
                                    />
                                </Box>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                <Box>
                                    <SelectInput
                                        source="status"
                                        label="Status"
                                        choices={statusOptions}
                                        variant="outlined"
                                        helperText="Status da pessoa"
                                    />
                                </Box>
                                <Box>
                                    <SelectInput
                                        source="tipo"
                                        label="Tipo"
                                        choices={tipoOptions}
                                        variant="outlined"
                                        helperText="Email obrigatório para membros"
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Card 2 — Contato, Batismo e Observações */}
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 3 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                            <Box>
                                <TextInput
                                    source="email"
                                    label="Email"
                                    variant="outlined"
                                    helperText="Obrigatório para membros"
                                />
                            </Box>
                            <Box>
                                <TextInput
                                    source="endereco"
                                    label="Endereço"
                                    variant="outlined"
                                    helperText="Opcional"
                                    multiline
                                    rows={3}
                                />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Section icon={BaptismIcon} title="Batismo" />
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                            <Box>
                                <SelectInput
                                    source="statusBatismo"
                                    label="Status do Batismo"
                                    choices={statusBatismoOptions}
                                    variant="outlined"
                                    helperText="Status do batismo"
                                />
                            </Box>
                            <Box>
                                <DateInput
                                    source="dataInteresseBatismo"
                                    label="Data de Interesse"
                                    variant="outlined"
                                    helperText="Opcional"
                                />
                            </Box>
                            <Box>
                                <DateInput
                                    source="dataBatismo"
                                    label="Data do Batismo"
                                    variant="outlined"
                                    helperText="Opcional"
                                />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <TextInput
                            source="observacoes"
                            label="Observações"
                            variant="outlined"
                            helperText="Informações adicionais (opcional)"
                            multiline
                            rows={3}
                            fullWidth
                        />
                    </Box>

                </Box>
            </SimpleForm>
        </Create>
    );
};

export default PessoaCreate;
