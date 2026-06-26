import {
    WaterDrop as BaptismIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import {
    DateInput,
    Edit,
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

const PessoaEdit = props => {
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
        <Edit {...props} title="Editar Pessoa">
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
                                <DateInput
                                    source="dataNascimento"
                                    label="Data de Nascimento"
                                    variant="outlined"
                                    helperText="Opcional"
                                    fullWidth
                                />
                                <TextInput
                                    source="telefone"
                                    label="Telefone"
                                    variant="outlined"
                                    helperText="Digite o número de telefone"
                                    fullWidth
                                />
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                <SelectInput
                                    source="status"
                                    label="Status"
                                    choices={statusOptions}
                                    variant="outlined"
                                    helperText="Status da pessoa"
                                    fullWidth
                                />
                                <SelectInput
                                    source="tipo"
                                    label="Tipo"
                                    choices={tipoOptions}
                                    variant="outlined"
                                    helperText="Email obrigatório para membros"
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* Card 2 — Contato, Batismo e Observações */}
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 3 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                            <TextInput
                                source="email"
                                label="Email"
                                variant="outlined"
                                helperText="Obrigatório para membros"
                                fullWidth
                            />
                            <TextInput
                                source="endereco"
                                label="Endereço"
                                variant="outlined"
                                helperText="Opcional"
                                multiline
                                rows={3}
                                fullWidth
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Section icon={BaptismIcon} title="Batismo" />
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                            <SelectInput
                                source="statusBatismo"
                                label="Status do Batismo"
                                choices={statusBatismoOptions}
                                variant="outlined"
                                helperText="Status do batismo"
                                fullWidth
                            />
                            <DateInput
                                source="dataInteresseBatismo"
                                label="Data de Interesse"
                                variant="outlined"
                                helperText="Opcional"
                                fullWidth
                            />
                            <DateInput
                                source="dataBatismo"
                                label="Data do Batismo"
                                variant="outlined"
                                helperText="Opcional"
                                fullWidth
                            />
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
        </Edit>
    );
};

export default PessoaEdit;
