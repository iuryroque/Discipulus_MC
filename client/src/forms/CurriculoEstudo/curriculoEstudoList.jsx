import React from 'react';
import { Datagrid, DeleteButton, EditButton, List, NumberField, ShowButton, TextField, TextInput } from 'react-admin';
import AuditList from '../../components/AuditList';

const postFilters = [
    <TextInput label="Filtrar pelo nome" source="nome" alwaysOn variant="outlined"/>,
    <TextInput label="Filtrar pela descrição" source="descricao" variant="outlined"/>,
    <TextInput label="Filtrar pelo nível" source="nivel" variant="outlined"/>,
    <TextInput label="Filtrar pelo status" source="status" variant="outlined"/>,
]; 

const CurriculoEstudoList = props => {

    return (

        <List {...props} filters={postFilters}>
            <Datagrid>
                <NumberField source="id" label="ID" />
                <TextField source="nome" label="Nome do Currículo" />
                <TextField source="descricao" label="Descrição" />
                <TextField source="nivel" label="Nível" />
                <TextField source="duracao" label="Duração" />
                <TextField source="status" label="Status" />
                <AuditList />
                <ShowButton />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    )
}

export default CurriculoEstudoList

    
