import {
    Person as PersonIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import {
    Card,
    CardContent,
    Grid,
    Typography
} from '@mui/material';
import React from 'react';
import {
    BooleanInput,
    Edit,
    ReferenceArrayInput,
    SelectArrayInput,
    SimpleForm,
    TextInput,
    minLength,
    required
} from 'react-admin';

const UserEdit = props => {
    return (
        <Edit {...props} title="Editar Usuário">
            <SimpleForm>
                <Grid container spacing={3}>
                    {/* Informações Básicas */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    color: 'primary.main'
                                }}>
                                    <PersonIcon />
                                    Informações do Usuário
                                </Typography>
                                
                                <TextInput 
                                    source="username" 
                                    label="Nome de Usuário"
                                    validate={[required(), minLength(3)]}
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                />
                                
                                <TextInput 
                                    source="password" 
                                    label="Nova Senha (deixe em branco para manter a atual)"
                                    type="password"
                                    validate={[minLength(6)]}
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    helperText="Preencha apenas se desejar alterar a senha"
                                />
                                
                                <BooleanInput 
                                    source="admin" 
                                    label="Administrador"
                                    margin="normal"
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Perfis */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    color: 'primary.main'
                                }}>
                                    <SecurityIcon />
                                    Perfis de Acesso
                                </Typography>
                                
                                <ReferenceArrayInput 
                                    source="profiles" 
                                    reference="profile"
                                    label="Perfis"
                                    margin="normal"
                                >
                                    <SelectArrayInput optionText="name" />
                                </ReferenceArrayInput>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </SimpleForm>
        </Edit>
    );
};

export default UserEdit; 