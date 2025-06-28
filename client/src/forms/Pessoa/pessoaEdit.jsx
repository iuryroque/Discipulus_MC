import React from 'react'
import { DateInput, Edit, NumberInput, ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin'

const PessoaEdit = props => {

    return (

        <Edit {...props}>
            <SimpleForm >
            <ReferenceInput source="acompanhamentoEstudo.id" reference="acompanhamentoEstudo">
                            <SelectInput optionText="status" variant="outlined"/>
                        </ReferenceInput>
<ReferenceInput source="alertas.id" reference="alertas">
                            <SelectInput optionText="tipo" variant="outlined"/>
                        </ReferenceInput>
<ReferenceInput source="presenca.id" reference="presenca">
                            <SelectInput optionText="presente" variant="outlined"/>
                        </ReferenceInput>
            <NumberInput source="id" variant="outlined"/>
<TextInput source="nomeCompleto" variant="outlined"/>
<DateInput source="dataNascimento" variant="outlined"/>
<TextInput source="telefone" variant="outlined"/>
<TextInput source="email" variant="outlined"/>
<TextInput source="endereco" variant="outlined"/>
<TextInput source="status" variant="outlined"/>
<TextInput source="tipo" variant="outlined"/>
<TextInput source="statusBatismo" variant="outlined"/>
<DateInput source="dataInteresseBatismo" variant="outlined"/>
<DateInput source="dataBatismo" variant="outlined"/>
<TextInput source="observacoes" variant="outlined"/>
            </SimpleForm>
        </Edit>
    )
}

export default PessoaEdit

    
