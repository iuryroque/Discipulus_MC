import React from 'react'
import { DateInput, Edit, SimpleForm, TextInput } from 'react-admin'

const AlertasEdit = props => {

    return (

        <Edit {...props}>
            <SimpleForm >
            <TextInput source="tipo" variant="outlined"/>
<TextInput source="titulo" variant="outlined"/>
<TextInput source="mensagem" variant="outlined"/>
<TextInput source="resolvido" variant="outlined"/>
<DateInput source="dataAlerta" variant="outlined"/>
<DateInput source="dataResolucao" variant="outlined"/>
            </SimpleForm>
        </Edit>
    )
}

export default AlertasEdit

    
