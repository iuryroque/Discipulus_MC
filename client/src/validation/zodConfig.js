import { z } from 'zod';

// Configuração global do Zod para mensagens em português
export const configureZodPortuguese = () => {
  z.setErrorMap((error, ctx) => {
    switch (error.code) {
      case z.ZodIssueCode.invalid_type:
        if (error.received === 'undefined' || error.received === 'null') {
          return { message: 'Campo obrigatório' };
        }
        return { message: `Tipo inválido, esperado ${error.expected}` };
      
      case z.ZodIssueCode.invalid_string:
        if (error.validation === 'email') {
          return { message: 'Email inválido' };
        }
        if (error.validation === 'url') {
          return { message: 'URL inválida' };
        }
        if (error.validation === 'uuid') {
          return { message: 'UUID inválido' };
        }
        if (error.validation === 'cuid') {
          return { message: 'CUID inválido' };
        }
        if (error.validation === 'regex') {
          return { message: 'Formato inválido' };
        }
        if (error.validation === 'datetime') {
          return { message: 'Data/hora inválida' };
        }
        return { message: 'String inválida' };
      
      case z.ZodIssueCode.too_small:
        if (error.type === 'string') {
          return { message: `Mínimo de ${error.minimum} caracteres` };
        }
        if (error.type === 'number') {
          return { message: `Mínimo de ${error.minimum}` };
        }
        if (error.type === 'array') {
          return { message: `Mínimo de ${error.minimum} itens` };
        }
        return { message: 'Valor muito pequeno' };
      
      case z.ZodIssueCode.too_big:
        if (error.type === 'string') {
          return { message: `Máximo de ${error.maximum} caracteres` };
        }
        if (error.type === 'number') {
          return { message: `Máximo de ${error.maximum}` };
        }
        if (error.type === 'array') {
          return { message: `Máximo de ${error.maximum} itens` };
        }
        return { message: 'Valor muito grande' };
      
      case z.ZodIssueCode.invalid_enum_value:
        return { message: `Valor inválido. Opções válidas: ${error.options.join(', ')}` };
      
      case z.ZodIssueCode.unrecognized_keys:
        return { message: `Chaves não reconhecidas: ${error.keys.join(', ')}` };
      
      case z.ZodIssueCode.invalid_arguments:
        return { message: 'Argumentos inválidos' };
      
      case z.ZodIssueCode.invalid_date:
        return { message: 'Data inválida' };
      
      case z.ZodIssueCode.invalid_intersection_types:
        return { message: 'Tipos de interseção inválidos' };
      
      case z.ZodIssueCode.not_multiple_of:
        return { message: `Deve ser múltiplo de ${error.multipleOf}` };
      
      case z.ZodIssueCode.not_finite:
        return { message: 'Deve ser um número finito' };
      
      default:
        return { message: 'Erro de validação' };
    }
  });
};

// Função helper para criar validações com mensagens personalizadas
export const createCustomValidation = (schema, customMessages = {}) => {
  return (values) => {
    try {
      schema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          // Usar mensagem personalizada se disponível, senão usar a padrão
          fieldErrors[field] = customMessages[field] || err.message;
        });
        return fieldErrors;
      }
      return { _error: 'Erro de validação desconhecido' };
    }
  };
};

// Mensagens padrão em português para campos comuns
export const defaultMessages = {
  required: 'Campo obrigatório',
  email: 'Email inválido',
  minLength: (min) => `Mínimo de ${min} caracteres`,
  maxLength: (max) => `Máximo de ${max} caracteres`,
  invalidDate: 'Data inválida',
  invalidPhone: 'Telefone inválido',
  invalidCPF: 'CPF inválido',
  passwordsNotMatch: 'Senhas não coincidem',
  invalidFormat: 'Formato inválido'
};

// Configurar Zod automaticamente quando o arquivo for importado
configureZodPortuguese(); 