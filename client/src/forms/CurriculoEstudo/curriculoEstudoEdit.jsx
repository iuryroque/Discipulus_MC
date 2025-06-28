import React from 'react'
import { Edit, SimpleForm, TextInput } from 'react-admin'

const CurriculoEstudoEdit = props => {

    return (

        <Edit {...props}>
            <SimpleForm >
                <TextInput source="nome" label="Nome do Currículo" variant="outlined"/>
                <TextInput source="descricao" label="Descrição" multiline rows={3} variant="outlined"/>
                <TextInput source="objetivos" label="Objetivos" multiline rows={3} variant="outlined"/>
                <TextInput source="duracao" label="Duração" variant="outlined"/>
                <TextInput source="nivel" label="Nível" variant="outlined"/>
                <TextInput source="status" label="Status" variant="outlined"/>
                <TextInput source="observacoes" label="Observações" multiline rows={2} variant="outlined"/>
            </SimpleForm>
        </Edit>
    )
}

export default CurriculoEstudoEdit

    
