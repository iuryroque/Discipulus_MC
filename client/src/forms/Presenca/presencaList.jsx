import {
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Chip } from '@mui/material';
import React from 'react';
import {
    Datagrid,
    DateField,
    DeleteButton,
    EditButton,
    Filter,
    List,
    NumberField,
    ReferenceField,
    ReferenceInput,
    SearchInput,
    SelectInput,
    ShowButton,
    TextField,
    TextInput
} from 'react-admin';
import AuditField from '../../components/AuditField';

const PresencaFilter = (props) => (
    <Filter {...props}>
        <SearchInput placeholder="Buscar por pessoa..." source="pessoa.nomeCompleto" alwaysOn />
        <ReferenceInput source="pessoa.id" reference="pessoa" alwaysOn>
            <SelectInput optionText="nomeCompleto" label="Pessoa" />
        </ReferenceInput>
        <SelectInput 
            source="presente" 
            choices={[
                { id: 'SIM', name: 'Presente' },
                { id: 'NAO', name: 'Ausente' },
                { id: 'JUSTIFICADO', name: 'Justificado' }
            ]}
            label="Status de Presença"
        />
        <TextInput 
            label="Observações" 
            source="observacoes" 
            variant="outlined"
        />
    </Filter>
);

const PresencaList = props => {
    return (
        <List 
            {...props} 
            // filters={<PresencaFilter />}
            title="Lista de Presenças"
            sort={{ field: 'id', order: 'DESC' }}
        >
            <Datagrid 
                rowClick="show"
                bulkActionButtons={false}
                sx={{
                    '& .RaDatagrid-row': {
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    },
                }}
            >
                <NumberField 
                    source="id" 
                    label="ID"
                    sx={{ fontWeight: 'bold' }}
                />
                
                <ReferenceField 
                    source="pessoa.id" 
                    reference="pessoa"
                    label="Pessoa"
                >
                    <TextField source="nomeCompleto" />
                </ReferenceField>
                
                <TextField 
                    source="presente" 
                    label="Status"
                    render={record => (
                        <Chip
                            label={record?.presente === 'SIM' ? 'Presente' : 
                                   record?.presente === 'NAO' ? 'Ausente' : 
                                   record?.presente === 'JUSTIFICADO' ? 'Justificado' : 'N/A'}
                            color={record?.presente === 'SIM' ? 'success' : 
                                   record?.presente === 'NAO' ? 'error' : 
                                   record?.presente === 'JUSTIFICADO' ? 'warning' : 'default'}
                            icon={record?.presente === 'SIM' ? <CheckCircleIcon /> : 
                                  record?.presente === 'NAO' ? <CancelIcon /> : 
                                  record?.presente === 'JUSTIFICADO' ? <ScheduleIcon /> : null}
                            size="small"
                            variant="outlined"
                        />
                    )}
                />
                
                <TextField 
                    source="observacoes" 
                    label="Observações"
                    render={record => (
                        <span style={{ 
                            maxWidth: '200px', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap',
                            display: 'block'
                        }}>
                            {record?.observacoes || 'Nenhuma observação'}
                        </span>
                    )}
                />
                
                <DateField 
                    source="criadoEm" 
                    label="Data de Registro"
                    showTime
                    options={{ 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }}
                />
                
                <AuditField 
                    variant="compact" 
                    label="Auditoria" 
                    sx={{ 
                        '& .RaAuditField-content': {
                            fontSize: '0.75rem'
                        }
                    }}
                />
                
                <ShowButton 
                    label="Visualizar"
                    sx={{ 
                        '& .RaButton-root': {
                            color: 'primary.main'
                        }
                    }}
                />
                <EditButton 
                    label="Editar"
                    sx={{ 
                        '& .RaButton-root': {
                            color: 'info.main'
                        }
                    }}
                />
                <DeleteButton 
                    label="Excluir"
                    sx={{ 
                        '& .RaButton-root': {
                            color: 'error.main'
                        }
                    }}
                />
            </Datagrid>
        </List>
    )
}

export default PresencaList

    
