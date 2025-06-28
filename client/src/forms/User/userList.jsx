import React from 'react';
import {
    BooleanField,
    ChipField,
    Datagrid,
    DeleteButton,
    EditButton,
    Filter,
    List,
    NumberField,
    ReferenceArrayField,
    SearchInput,
    SingleFieldList,
    TextField,
    TextInput
} from 'react-admin';

const UserFilter = (props) => (
    <Filter {...props}>
        <SearchInput placeholder="Buscar por usuário..." source="username" alwaysOn />
        <TextInput label="Username" source="username" variant="outlined" />
    </Filter>
);

const UserList = props => {
    return (
        <List {...props} filters={<UserFilter />}>
            <Datagrid>
                <NumberField source="id" label="ID" />
                <TextField source="username" label="Usuário" />
                <BooleanField source="admin" label="Administrador" />
                <ReferenceArrayField source="profiles" reference="profile" label="Perfis">
                    <SingleFieldList>
                        <ChipField source="name" />
                    </SingleFieldList>
                </ReferenceArrayField>
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    );
};

export default UserList; 