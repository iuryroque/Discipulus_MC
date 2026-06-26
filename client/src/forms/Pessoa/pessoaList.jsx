import { Box, CircularProgress } from '@mui/material';
import {
    Datagrid,
    DateField,
    List,
    SelectInput,
    TextField,
    TextInput,
    WrapperField,
    useRecordContext,
} from 'react-admin';
import { DotChip, ListActions, RowActions } from '../../components/SharedListActions';
import { usePessoaEnumOptions } from '../../hooks/useEnumOptions';

const DOT_CONFIG = {
    status: {
        ATIVO:     { dot: '#4caf50', label: 'Ativo' },
        INATIVO:   { dot: '#f44336', label: 'Inativo' },
        PENDENTE:  { dot: '#ff9800', label: 'Pendente' },
    },
    tipo: {
        MEMBRO:    { dot: '#2196f3', label: 'Membro' },
        VISITANTE: { dot: '#9c27b0', label: 'Visitante' },
    },
    batismo: {
        BATIZADO:     { dot: '#009688', label: 'Batizado' },
        NAO_BATIZADO: { dot: '#9e9e9e', label: 'Não Batizado' },
        INTERESSADO:  { dot: '#ff9800', label: 'Interessado' },
    },
};

const toColorMap = group => Object.fromEntries(Object.entries(DOT_CONFIG[group]).map(([k, v]) => [k, v.dot]));
const toLabelMap = group => Object.fromEntries(Object.entries(DOT_CONFIG[group]).map(([k, v]) => [k, v.label]));

const StatusChip = () => {
    const record = useRecordContext();
    if (!record) return null;
    return <DotChip value={record.status} colorMap={toColorMap('status')} labelMap={toLabelMap('status')} />;
};

const TipoChip = () => {
    const record = useRecordContext();
    if (!record) return null;
    return <DotChip value={record.tipo} colorMap={toColorMap('tipo')} labelMap={toLabelMap('tipo')} />;
};

const BatismoChip = () => {
    const record = useRecordContext();
    if (!record) return null;
    return <DotChip value={record.statusBatismo} colorMap={toColorMap('batismo')} labelMap={toLabelMap('batismo')} />;
};

const PessoaList = props => {
    const { statusOptions, tipoOptions, statusBatismoOptions, loading } = usePessoaEnumOptions();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
            </Box>
        );
    }

    const postFilters = [
        <TextInput label="Buscar pelo nome" source="nomeCompleto" alwaysOn variant="outlined" />,
        <TextInput label="Telefone" source="telefone" variant="outlined" />,
        <TextInput label="Email" source="email" variant="outlined" />,
        <SelectInput label="Status" source="status" choices={statusOptions} variant="outlined" />,
        <SelectInput label="Tipo" source="tipo" choices={tipoOptions} variant="outlined" />,
        <SelectInput label="Batismo" source="statusBatismo" choices={statusBatismoOptions} variant="outlined" />,
    ];

    return (
        <List {...props} filters={postFilters} actions={<ListActions createLabel="Novo" />} title="Lista de Pessoas">
            <Datagrid rowClick="show" bulkActionButtons={false}>
                <TextField source="nomeCompleto" label="Nome" />
                <TextField source="telefone" label="Telefone" />
                <WrapperField label="Status"><StatusChip /></WrapperField>
                <WrapperField label="Tipo"><TipoChip /></WrapperField>
                <WrapperField label="Batismo"><BatismoChip /></WrapperField>
                <DateField source="dataNascimento" label="Nascimento" showTime={false} />
                <WrapperField label="">
                    <RowActions resource="pessoa" />
                </WrapperField>
            </Datagrid>
        </List>
    );
};

export default PessoaList;
