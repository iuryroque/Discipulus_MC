import React from 'react'
import { Create, SimpleForm, TextInput } from 'react-admin'

const CurriculoEstudoCreate = props => {

    return (

        <Create {...props}  >
            <SimpleForm>
                <TextInput source="nome" label="Nome do Currículo" variant="outlined"/>
                <TextInput source="descricao" label="Descrição" multiline rows={3} variant="outlined"/>
                <TextInput source="objetivos" label="Objetivos" multiline rows={3} variant="outlined"/>
                <TextInput source="duracao" label="Duração" variant="outlined"/>
                <TextInput source="nivel" label="Nível" variant="outlined"/>
                <TextInput source="status" label="Status" variant="outlined"/>
                <TextInput source="observacoes" label="Observações" multiline rows={2} variant="outlined"/>
            </SimpleForm>
        </Create>
    )
}

export default CurriculoEstudoCreate

    
