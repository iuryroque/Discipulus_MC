import React from 'react'
import { Edit, NumberInput, ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin'
    
const LicoesCurriculoEdit = props => {

    return (
        <Edit {...props}>
            <SimpleForm >
                <ReferenceInput source="curriculoEstudo.id" reference="curriculoEstudo" label="Currículo de Estudo">
                    <SelectInput optionText="nome" variant="outlined"/>
                </ReferenceInput>
                <NumberInput source="numeroLicao" label="Número da Lição" variant="outlined"/>
                <TextInput source="titulo" label="Título da Lição" variant="outlined"/>
                <TextInput source="conteudo" label="Conteúdo" multiline rows={4} variant="outlined"/>
                <TextInput source="duracao" label="Duração" variant="outlined"/>
                <TextInput source="objetivos" label="Objetivos" multiline rows={3} variant="outlined"/>
                <TextInput source="materiais" label="Materiais Necessários" multiline rows={2} variant="outlined"/>
                <NumberInput source="ordem" label="Ordem na Grade" variant="outlined" />
            </SimpleForm>
        </Edit>
    )
}
    
export default LicoesCurriculoEdit

    
