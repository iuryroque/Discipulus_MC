import { Box } from '@mui/material';
import {
    BooleanInput,
    Datagrid,
    DateField,
    FunctionField,
    List,
    SelectInput,
    TextField,
    TextInput,
    WrapperField,
} from 'react-admin';
import { DotChip, ListActions, RowActions } from '../../components/SharedListActions';

const TIPO_COLORS = {
    AVISO:     '#ff9800',
    URGENTE:   '#f44336',
    LEMBRETE:  '#2196f3',
    INFO:      '#607d8b',
};

const TIPO_LABELS = {
    AVISO:     'Aviso',
    URGENTE:   'Urgente',
    LEMBRETE:  'Lembrete',
    INFO:      'Info',
};

const RESOLVIDO_COLORS = {
    true:  '#4caf50',
    false: '#f44336',
};

const RESOLVIDO_LABELS = {
    true:  'Resolvido',
    false: 'Pendente',
};

const alertaFilters = [
    <TextInput label="Título" source="titulo" alwaysOn variant="outlined" />,
    <TextInput label="Tipo" source="tipo" variant="outlined" />,
    <SelectInput
        label="Status"
        source="resolvido"
        variant="outlined"
        choices={[
            { id: 'true', name: 'Resolvido' },
            { id: 'false', name: 'Pendente' },
        ]}
    />,
];

const AlertasList = props => (
    <List
        {...props}
        filters={alertaFilters}
        actions={<ListActions createLabel="Novo Alerta" />}
        title="Alertas"
    >
        <Datagrid rowClick="show" bulkActionButtons={false}>
            <WrapperField label="Tipo">
                <FunctionField render={r => (
                    <DotChip value={r.tipo} colorMap={TIPO_COLORS} labelMap={TIPO_LABELS} />
                )} />
            </WrapperField>
            <TextField source="titulo" label="Título" />
            <TextField source="mensagem" label="Mensagem" />
            <WrapperField label="Status">
                <FunctionField render={r => (
                    <DotChip
                        value={String(r.resolvido)}
                        colorMap={RESOLVIDO_COLORS}
                        labelMap={RESOLVIDO_LABELS}
                    />
                )} />
            </WrapperField>
            <DateField source="dataAlerta" label="Data do Alerta" />
            <DateField source="dataResolucao" label="Resolvido em" />
            <WrapperField label="">
                <RowActions resource="alertas" />
            </WrapperField>
        </Datagrid>
    </List>
);

export default AlertasList;
