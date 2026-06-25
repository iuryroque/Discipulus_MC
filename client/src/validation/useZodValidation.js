import { useMemo } from 'react';
import { z } from 'zod';
import './zodConfig'; // Importa a configuração global do Zod

/**
 * Hook personalizado para criar validações Zod compatíveis com React Admin v5
 * @param {z.ZodSchema} schema - Esquema Zod para validação
 * @returns {Function} Função de validação compatível com React Admin
 */
export const useZodValidation = (schema) => {
  return useMemo(() => {
    return (values) => {
      try {
        schema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = {};
          error.errors.forEach((err) => {
            const field = err.path.join('.');
            fieldErrors[field] = err.message;
          });
          return fieldErrors;
        }
        return { _error: 'Erro de validação desconhecido' };
      }
    };
  }, [schema]);
};

/**
 * Hook para criar validações de campos individuais
 * @param {z.ZodSchema} fieldSchema - Esquema Zod para um campo específico
 * @returns {Function} Função de validação para campo individual
 */
export const useFieldValidation = (fieldSchema) => {
  return useMemo(() => {
    return (value) => {
      try {
        fieldSchema.parse(value);
        return undefined;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors[0]?.message || 'Campo inválido';
        }
        return 'Erro de validação';
      }
    };
  }, [fieldSchema]);
};

/**
 * Hook para criar validações assíncronas (útil para validações que dependem de APIs)
 * @param {Function} asyncValidator - Função assíncrona que retorna um esquema Zod
 * @returns {Function} Função de validação assíncrona
 */
export const useAsyncZodValidation = (asyncValidator) => {
  return useMemo(() => {
    return async (values) => {
      try {
        const schema = await asyncValidator(values);
        schema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = {};
          error.errors.forEach((err) => {
            const field = err.path.join('.');
            fieldErrors[field] = err.message;
          });
          return fieldErrors;
        }
        return { _error: 'Erro de validação desconhecido' };
      }
    };
  }, [asyncValidator]);
};

/**
 * Função helper para criar validações condicionais
 * @param {z.ZodSchema} schema - Esquema base
 * @param {Function} condition - Função que retorna true se a validação deve ser aplicada
 * @returns {Function} Função de validação condicional
 */
export const createConditionalValidation = (schema, condition) => {
  return (values) => {
    if (!condition(values)) {
      return {};
    }
    
    try {
      schema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          fieldErrors[field] = err.message;
        });
        return fieldErrors;
      }
      return { _error: 'Erro de validação desconhecido' };
    }
  };
}; 