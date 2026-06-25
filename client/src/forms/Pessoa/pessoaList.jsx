import { CircularProgress } from '@mui/material';
import React from 'react';
import {
    ChipField,
    Datagrid,
    DateField,
    DeleteButton,
    EditButton,
    List,
    SelectInput,
    ShowButton,
    TextField,
    TextInput
} from 'react-admin';
import { usePessoaEnumOptions } from '../../hooks/useEnumOptions';

const PessoaList = props => {
    const { statusOptions, tipoOptions, statusBatismoOptions, loading } = usePessoaEnumOptions();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </div>
        );
    }

    const postFilters = [
        <TextInput 
            label="Filtrar pelo nome" 
            source="nomeCompleto" 
            alwaysOn 
            variant="outlined"
        />,
        <TextInput 
            label="Filtrar pelo telefone" 
            source="telefone" 
            variant="outlined"
        />,
        <TextInput 
            label="Filtrar pelo email" 
            source="email" 
            variant="outlined"
        />,
        <SelectInput 
            label="Status" 
            source="status" 
            choices={statusOptions}
            variant="outlined"
        />,
        <SelectInput 
            label="Tipo" 
            source="tipo" 
            choices={tipoOptions}
            variant="outlined"
        />,
        <SelectInput 
            label="Status do Batismo" 
            source="statusBatismo" 
            choices={statusBatismoOptions}
            variant="outlined"
        />
    ]; 

    return (
        <List {...props} 
            // filters={postFilters}
            title="Lista de Pessoas"
        >
            <Datagrid>
                <TextField source="nomeCompleto" label="Nome Completo" />
                <TextField source="telefone" label="Telefone" />
                {/* <TextField source="email" label="Email" /> */}
                <ChipField source="status" label="Status" choices={statusOptions} />
                <ChipField source="tipo" label="Tipo" choices={tipoOptions} />
                <ChipField source="statusBatismo" label="Status Batismo" choices={statusBatismoOptions} />
                <DateField source="dataNascimento" label="Data Nascimento" showTime={false} />
                <ShowButton label='Ver' />
                <EditButton label='Editar' />
                <DeleteButton label='Excluir' />
            </Datagrid>
        </List>
    );
};

export default PessoaList;

    
