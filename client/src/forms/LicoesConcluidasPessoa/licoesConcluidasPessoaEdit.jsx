import React from 'react'
import { DateInput, Edit, ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin'

const LicoesConcluidasPessoaEdit = props => {

    return (

        <Edit {...props}>
            <SimpleForm >
            <ReferenceInput source="pessoa.id" reference="pessoa">
                            <SelectInput optionText="nomeCompleto" variant="outlined"/>
                        </ReferenceInput>
            <ReferenceInput source="licoesCurriculo.id" reference="licoesCurriculo">
                            <SelectInput optionText="titulo" variant="outlined"/>
                        </ReferenceInput>
<DateInput source="dataConclusao" variant="outlined"/>
<TextInput source="observacoes" variant="outlined"/>
            </SimpleForm>
        </Edit>
    )
}

export default LicoesConcluidasPessoaEdit

    
