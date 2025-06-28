import React from 'react';
import { Datagrid, DateField, DeleteButton, EditButton, List, NumberField, ShowButton, TextField, TextInput } from 'react-admin';

const postFilters = [
        <TextInput label="Filtrar pelo status" source="status" alwaysOn variant="outlined"/>,
        ]; 

const AcompanhamentoEstudoList = props => {

    return (

        <List {...props} filters={postFilters}>
            <Datagrid>
                <NumberField source="id" variant="outlined"/>
<TextField source="status" variant="outlined" />
<DateField  source="dataInicio" variant="outlined"/>
<DateField  source="dataConclusao" variant="outlined"/>
<DateField  source="criadoEm" variant="outlined"/>
<DateField  source="alteradoEm" variant="outlined"/>
                <ShowButton />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    )
}

export default AcompanhamentoEstudoList

    
