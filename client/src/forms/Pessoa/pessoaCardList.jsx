import { Add } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { List, useDelete, useNotify, useRedirect } from 'react-admin';
import { PessoaCardGrid } from './components/PessoaCardGrid';

const PessoaCardList = (props) => {
    const redirect = useRedirect();
    const notify = useNotify();
    const [deleteOne] = useDelete();

    const handleEdit = (id) => redirect('edit', 'pessoa', id);
    const handleShow = (id) => redirect('show', 'pessoa', id);
    const handleCreate = () => redirect('create', 'pessoa');

    const handleDelete = (id) => {
        deleteOne('pessoa', { id }, {
            onSuccess: () => notify('Visitante excluído com sucesso!', { type: 'success' }),
            onError: (error) => notify(`Erro ao excluir: ${error.message || 'tente novamente'}`, { type: 'error' }),
        });
    };

    return (
        <List
            {...props}
            resource="pessoa/cards"
            pagination={false}
            actions={null}
            component="div"
            title=" "
        >
            <Box sx={{ p: 3 }}>
                {/* Header da Página */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>Acompanhamento de Visitantes</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            Gerencie e acompanhe o progresso dos visitantes da igreja
                        </Typography>
                    </Box>
                    <Button variant="contained" startIcon={<Add />} onClick={handleCreate} sx={{ fontWeight: 600, py: 1.2, fontSize: 16 }}>
                        Novo Visitante
                    </Button>
                </Box>

                {/* Grid de Conteúdo */}
                <PessoaCardGrid 
                    onEdit={handleEdit}
                    onShow={handleShow}
                    onDelete={handleDelete}
                />
            </Box>
        </List>
    );
};

export default PessoaCardList;