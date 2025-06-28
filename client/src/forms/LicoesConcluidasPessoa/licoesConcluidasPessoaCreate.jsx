import React from 'react'
import { Create, DateInput, ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin'

const LicoesConcluidasPessoaCreate = props => {

    return (

        <Create {...props}  >
            <SimpleForm>
            <ReferenceInput source="pessoa.id" reference="pessoa">
                            <SelectInput optionText="nomeCompleto" variant="outlined"/>
                        </ReferenceInput>
            <ReferenceInput source="licoesCurriculo.id" reference="licoesCurriculo">
                            <SelectInput optionText="titulo" variant="outlined"/>
                        </ReferenceInput>
            <DateInput source="dataConclusao" variant="outlined"/>
<TextInput source="observacoes" variant="outlined"/>
            </SimpleForm>
        </Create>
    )
}

export default LicoesConcluidasPessoaCreate

    
