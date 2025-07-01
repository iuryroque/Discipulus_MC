import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';

/**
 * Hook personalizado para buscar opções de enums do backend
 * @param {string} resource - Nome do recurso (ex: 'pessoa')
 * @param {string} enumType - Tipo do enum (ex: 'status', 'tipo', 'statusBatismo')
 * @returns {Object} - { options, loading, error }
 */
export const useEnumOptions = (resource, enumType) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dataProvider = useDataProvider();

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await dataProvider.getList(`${resource}/enums/${enumType}`, {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'name', order: 'ASC' },
                    filter: {}
                });
                
                setOptions(response.data);
            } catch (err) {
                console.error(`Erro ao buscar opções do enum ${enumType}:`, err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [resource, enumType, dataProvider]);

    return { options, loading, error };
};

/**
 * Hook para buscar todas as opções de enums de pessoa
 * @returns {Object} - { statusOptions, tipoOptions, statusBatismoOptions, loading, error }
 */
export const usePessoaEnumOptions = () => {
    const statusResult = useEnumOptions('pessoa', 'status');
    const tipoResult = useEnumOptions('pessoa', 'tipo');
    const statusBatismoResult = useEnumOptions('pessoa', 'statusBatismo');

    const loading = statusResult.loading || tipoResult.loading || statusBatismoResult.loading;
    const error = statusResult.error || tipoResult.error || statusBatismoResult.error;

    return {
        statusOptions: statusResult.options,
        tipoOptions: tipoResult.options,
        statusBatismoOptions: statusBatismoResult.options,
        loading,
        error
    };
}; 