import React from 'react';
import { Datagrid, DateField, DeleteButton, EditButton, List, NumberField, ShowButton, TextField, TextInput } from 'react-admin';
import AuditField from '../../components/AuditField';

const postFilters = [
        <TextInput label="Filtrar pelo nome completo" source="nomeCompleto" alwaysOn variant="outlined"/>,<TextInput label="Filtrar pelo telefone" source="telefone" alwaysOn variant="outlined"/>,<TextInput label="Filtrar pelo email" source="email" alwaysOn variant="outlined"/>,<TextInput label="Filtrar pelo endereco" source="endereco" alwaysOn variant="outlined"/>,<TextInput label="Filtrar pelo status" source="status" alwaysOn variant="outlined"/>,<TextInput label="Filtrar pelo tipo" source="tipo" alwaysOn variant="outlined"/>,<TextInput label="Filtrar pelo status batismo" source="statusBatismo" alwaysOn variant="outlined"/>,<TextInput label="Filtrar pelo observacoes" source="observacoes" alwaysOn variant="outlined"/>,
        ]; 

const PessoaList = props => {

    return (

        <List {...props} filters={postFilters}>
            <Datagrid>
                <NumberField source="id" variant="outlined"/>
<TextField source="nomeCompleto" variant="outlined" />
<DateField  source="dataNascimento" variant="outlined"/>
<TextField source="telefone" variant="outlined" />
<TextField source="email" variant="outlined" />
<TextField source="endereco" variant="outlined" />
<TextField source="status" variant="outlined" />
<TextField source="tipo" variant="outlined" />
<TextField source="statusBatismo" variant="outlined" />
<DateField  source="dataInteresseBatismo" variant="outlined"/>
<DateField  source="dataBatismo" variant="outlined"/>
<TextField source="observacoes" variant="outlined" />
<AuditField variant="compact" label="Auditoria" />
                <ShowButton />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    )
}

export default PessoaList

    
