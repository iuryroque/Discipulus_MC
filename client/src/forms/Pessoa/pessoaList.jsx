import React from 'react';
import {
    ChipField,
    Datagrid,
    DateField,
    DeleteButton,
    EditButton,
    List,
    SelectInput,
    ShowButton,
    TextField,
    TextInput
} from 'react-admin';
import AuditField from '../../components/AuditField';

const postFilters = [
    <TextInput 
        label="Filtrar pelo nome" 
        source="nomeCompleto" 
        alwaysOn 
        variant="outlined"
    />,
    <TextInput 
        label="Filtrar pelo telefone" 
        source="telefone" 
        variant="outlined"
    />,
    <TextInput 
        label="Filtrar pelo email" 
        source="email" 
        variant="outlined"
    />,
    <SelectInput 
        label="Status" 
        source="status" 
        choices={[
            { id: 'ATIVO', name: 'Ativo' },
            { id: 'INATIVO', name: 'Inativo' },
            { id: 'PENDENTE', name: 'Pendente' }
        ]}
        variant="outlined"
    />,
    <SelectInput 
        label="Tipo" 
        source="tipo" 
        choices={[
            { id: 'MEMBRO', name: 'Membro' },
            { id: 'VISITANTE', name: 'Visitante' },
            { id: 'CONGREGADO', name: 'Congregado' }
        ]}
        variant="outlined"
    />,
    <SelectInput 
        label="Status do Batismo" 
        source="statusBatismo" 
        choices={[
            { id: 'BATIZADO', name: 'Batizado' },
            { id: 'NAO_BATIZADO', name: 'Não Batizado' },
            { id: 'INTERESSADO', name: 'Interessado' }
        ]}
        variant="outlined"
    />
]; 

const PessoaList = props => {
    return (
        <List {...props} filters={postFilters} title="Lista de Pessoas">
            <Datagrid>
                <TextField source="nomeCompleto" label="Nome Completo" />
                <TextField source="telefone" label="Telefone" />
                <TextField source="email" label="Email" />
                <ChipField source="status" label="Status" />
                <ChipField source="tipo" label="Tipo" />
                <ChipField source="statusBatismo" label="Status Batismo" />
                <DateField source="dataNascimento" label="Data Nascimento" showTime={false} />
                <AuditField variant="compact" label="Auditoria" />
                <ShowButton />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    );
};

export default PessoaList;

    
