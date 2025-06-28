import React from 'react'
import { DateTimeInput, Edit, SimpleForm, TextInput } from 'react-admin'

const CultoEdit = props => {

    return (

        <Edit {...props}>
            <SimpleForm >
            <TextInput source="titulo" variant="outlined"/>
<TextInput source="descricao" variant="outlined"/>
<TextInput source="local" variant="outlined"/>
<DateTimeInput source="dataHora" variant="outlined"/>
<TextInput source="pregador" variant="outlined"/>
<TextInput source="status" variant="outlined"/>
<TextInput source="observacoes" variant="outlined"/>
            </SimpleForm>
        </Edit>
    )
}

export default CultoEdit

    
