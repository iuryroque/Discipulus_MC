import React from 'react';
import { Datagrid, DateField, DeleteButton, EditButton, List, NumberField, ShowButton, TextField, TextInput } from 'react-admin';

const postFilters = [
        <TextInput label="Filtrar pelo titulo" source="titulo" alwaysOn variant="outlined"/>,<TextInput label="Filtrar pelo local" source="local" alwaysOn variant="outlined"/>,<TextInput label="Filtrar pelo descricao" source="descricao" alwaysOn variant="outlined"/>,
        ]; 

const CultoList = props => {

    return (

        <List {...props} filters={postFilters}>
            <Datagrid>
                <NumberField source="id" variant="outlined"/>
<TextField source="titulo" variant="outlined" />
<TextField source="descricao" variant="outlined" />
<TextField source="local" variant="outlined" />
<DateField  source="dataHora" variant="outlined"/>
<TextField source="pregador" variant="outlined" />
<TextField source="status" variant="outlined" />
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

export default CultoList 