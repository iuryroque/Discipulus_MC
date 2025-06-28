import React from 'react'
import { DateInput, Edit, ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin'

const AcompanhamentoEstudoEdit = props => {

    return (

        <Edit {...props}>
            <SimpleForm >
            <ReferenceInput source="licoesConcluidasPessoa.id" reference="licoesConcluidasPessoa">
                            <SelectInput optionText="dataConclusao" variant="outlined"/>
                        </ReferenceInput>
            <TextInput source="status" variant="outlined"/>
<DateInput source="dataInicio" variant="outlined"/>
<DateInput source="dataConclusao" variant="outlined"/>
            </SimpleForm>
        </Edit>
    )
}

export default AcompanhamentoEstudoEdit

    
