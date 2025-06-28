import React from 'react'
import { Create, DateInput, SimpleForm, TextInput } from 'react-admin'

const AlertasCreate = props => {

    return (

        <Create {...props}  >
            <SimpleForm>
            <TextInput source="tipo" variant="outlined"/>
<TextInput source="titulo" variant="outlined"/>
<TextInput source="mensagem" variant="outlined"/>
<TextInput source="resolvido" variant="outlined"/>
<DateInput source="dataAlerta" variant="outlined"/>
<DateInput source="dataResolucao" variant="outlined"/>
            </SimpleForm>
        </Create>
    )
}

export default AlertasCreate

    
