import React from 'react';
import { Datagrid, DateField, DeleteButton, EditButton, List, NumberField, ShowButton, TextField, TextInput } from 'react-admin';

const postFilters = [
        <TextInput label="Filtrar pelo observacoes" source="observacoes" alwaysOn variant="outlined"/>,
        ]; 

const LicoesConcluidasPessoaList = props => {

    return (

        <List {...props} filters={postFilters}>
            <Datagrid>
                <NumberField source="id" variant="outlined"/>
<DateField  source="dataConclusao" variant="outlined"/>
<TextField source="observacoes" variant="outlined" />
<DateField  source="criadoEm" variant="outlined"/>
<DateField  source="alteradoEm" variant="outlined"/>
                <ShowButton />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    )
}

export default LicoesConcluidasPessoaList

    
