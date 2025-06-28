import React from 'react'
import { Create, DateInput, ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin'

const AcompanhamentoEstudoCreate = props => {

    return (

        <Create {...props}  >
            <SimpleForm>
            <ReferenceInput source="licoesConcluidasPessoa.id" reference="licoesConcluidasPessoa">
                            <SelectInput optionText="dataConclusao" variant="outlined"/>
                        </ReferenceInput>
            <TextInput source="status" variant="outlined"/>
            <DateInput source="dataInicio" variant="outlined"/>
            <DateInput source="dataConclusao" variant="outlined"/>
            </SimpleForm>
        </Create>
    )
}

export default AcompanhamentoEstudoCreate

    
