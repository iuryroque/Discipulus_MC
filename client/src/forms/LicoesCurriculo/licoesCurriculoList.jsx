import React from 'react';
import { Datagrid, DeleteButton, EditButton, List, NumberField, ReferenceField, ShowButton, TextField, TextInput } from 'react-admin';
import AuditList from '../../components/AuditList';
    
const postFilters = [
    <TextInput label="Filtrar pelo título" source="titulo" alwaysOn variant="outlined"/>,
    <TextInput label="Filtrar pelo conteúdo" source="conteudo" variant="outlined"/>,
    <TextInput label="Filtrar pelo número" source="numeroLicao" variant="outlined"/>,
]; 

const LicoesCurriculoList = props => {

    return (
        <List {...props} filters={postFilters}>
            <Datagrid>
                <NumberField source="id" label="ID" />
                <ReferenceField source="curriculoEstudo.id" reference="curriculoEstudo" label="Currículo">
                    <TextField source="nome" />
                </ReferenceField>
                <NumberField source="numeroLicao" label="Número" />
                <TextField source="titulo" label="Título" />
                <TextField source="duracao" label="Duração" />
                <NumberField source="ordem" label="Ordem" />
                <AuditList />
                <ShowButton />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    )
}
    
export default LicoesCurriculoList

    
