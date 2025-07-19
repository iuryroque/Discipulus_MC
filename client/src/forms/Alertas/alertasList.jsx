import React from 'react';
import { Datagrid, DateField, DeleteButton, EditButton, List, NumberField, ShowButton, TextField, TextInput } from 'react-admin';

const postFilters = [
        <TextInput label="Filtrar pelo tipo" source="tipo" alwaysOn variant="outlined"/>,<TextInput label="Filtrar pelo titulo" source="titulo" alwaysOn variant="outlined"/>,<TextInput label="Filtrar pelo mensagem" source="mensagem" alwaysOn variant="outlined"/>,<TextInput label="Filtrar pelo resolvido" source="resolvido" alwaysOn variant="outlined"/>,
        ]; 

const AlertasList = props => {

    return (

        <List {...props} 
        // filters={postFilters}
        >
            <Datagrid>
                <NumberField source="id" variant="outlined"/>
                <TextField source="tipo" variant="outlined" />
                <TextField source="titulo" variant="outlined" />
                <TextField source="mensagem" variant="outlined" />
                <TextField source="resolvido" variant="outlined" />
                <DateField  source="dataAlerta" variant="outlined"/>
                <DateField  source="dataResolucao" variant="outlined"/>
                <DateField  source="criadoEm" variant="outlined"/>
                <DateField  source="alteradoEm" variant="outlined"/>
                <ShowButton />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    )
}

export default AlertasList

    
