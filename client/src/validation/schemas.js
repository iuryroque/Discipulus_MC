import { z } from 'zod';
import './zodConfig'; // Importa a configuração global do Zod

// Esquema para Pessoa
export const pessoaSchema = z.object({
  nomeCompleto: z.string()
    .min(1, 'Nome completo é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  dataNascimento: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Data de nascimento deve ser uma data válida'
    }),
  telefone: z.string()
    .min(1, 'Telefone é obrigatório')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Telefone deve conter apenas números, espaços, hífens, parênteses e +'),
  email: z.string()
    .email('Email deve ser válido')
    .optional()
    .or(z.literal('')),
  endereco: z.string()
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .optional()
    .or(z.literal('')),
  status: z.enum(['ATIVO', 'INATIVO', 'PENDENTE'], {
    errorMap: () => ({ message: 'Status deve ser ATIVO, INATIVO ou PENDENTE' })
  }).default('ATIVO'),
  tipo: z.enum(['MEMBRO', 'VISITANTE', 'CONGREGADO', 'INTERESSADO'], {
    errorMap: () => ({ message: 'Tipo deve ser MEMBRO, VISITANTE, CONGREGADO ou INTERESSADO' })
  }).default('VISITANTE'),
  statusBatismo: z.enum(['BATIZADO', 'NO BATIZADO', 'INTERESSADO'], {
    errorMap: () => ({ message: 'Status do batismo deve ser BATIZADO, NÃO BATIZADO ou INTERESSADO' })
  }).default('NÃO BATIZADO'),
  dataInteresseBatismo: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Data de interesse no batismo deve ser uma data válida'
    }),
  dataBatismo: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Data do batismo deve ser uma data válida'
    }),
  observacoes: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
    .or(z.literal(''))
});

// Esquema condicional para Pessoa (email obrigatório apenas para membros)
export const pessoaCondicionalSchema = z.object({
  nomeCompleto: z.string()
    .min(1, 'Nome completo é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  dataNascimento: z.string()
    .nullable()
    .optional(),
  telefone: z.string()
    .min(1, 'Telefone é obrigatório')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Telefone deve conter apenas números, espaços, hífens, parênteses e +'),
  email: z.string()
    .email('Email deve ser válido')
    .nullable()
    .optional(),
  endereco: z.string()
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .nullable()
    .optional(),
  status: z.enum(['ATIVO', 'INATIVO', 'PENDENTE'], {
    errorMap: () => ({ message: 'Status deve ser ATIVO, INATIVO ou PENDENTE' })
  }).default('ATIVO'),
  tipo: z.enum(['MEMBRO', 'VISITANTE', 'CONGREGADO', 'INTERESSADO'], {
    errorMap: () => ({ message: 'Tipo deve ser MEMBRO, VISITANTE, CONGREGADO ou INTERESSADO' })
  }).default('VISITANTE'),
  statusBatismo: z.enum(['BATIZADO', 'NAO_BATIZADO', 'INTERESSADO'], {
    errorMap: () => ({ message: 'Status do batismo deve ser BATIZADO, NÃO BATIZADO ou INTERESSADO' })
  }).default('NAO_BATIZADO'),
  dataInteresseBatismo: z.string()
    .nullable()
    .optional()
    .refine((val) => !val || val === '' || !isNaN(Date.parse(val)), {
      message: 'Data de interesse no batismo deve ser uma data válida'
    }),
  dataBatismo: z.string()
    .nullable()
    .optional()
    .refine((val) => !val || val === '' || !isNaN(Date.parse(val)), {
      message: 'Data do batismo deve ser uma data válida'
    }),
  observacoes: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .nullable()
    .optional()
}).superRefine((data, ctx) => {
  // Validação condicional: email obrigatório apenas para membros
  if (data.tipo === 'MEMBRO' && (!data.email || data.email.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Email é obrigatório para membros',
      path: ['email']
    });
  }
});

// Esquema para Currículo de Estudo
export const curriculoEstudoSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  descricao: z.string()
    .min(1, 'Descrição é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  nivel: z.enum(['Básico', 'Intermediário', 'Avançado'], {
    errorMap: () => ({ message: 'Nível deve ser Básico, Intermediário ou Avançado' })
  }),
  status: z.enum(['ATIVO', 'INATIVO', 'EM_DESENVOLVIMENTO'], {
    errorMap: () => ({ message: 'Status deve ser ATIVO, INATIVO ou EM_DESENVOLVIMENTO' })
  }).default('ATIVO'),
  duracao: z.string()
    .max(50, 'Duração deve ter no máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  objetivos: z.string()
    .max(1000, 'Objetivos devem ter no máximo 1000 caracteres')
    .optional()
    .or(z.literal('')),
  observacoes: z.string()
    .max(1000, 'Observações devem ter no máximo 1000 caracteres')
    .optional()
    .or(z.literal(''))
});

// Esquema para Lições do Currículo
export const licoesCurriculoSchema = z.object({
  curriculoEstudo: z.object({
    id: z.number().min(1, 'Currículo é obrigatório')
  }),
  numeroLicao: z.number()
    .min(1, 'Número da lição deve ser maior que 0')
    .max(999, 'Número da lição deve ser menor que 999'),
  titulo: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  conteudo: z.string()
    .min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
    .max(5000, 'Conteúdo deve ter no máximo 5000 caracteres'),
  duracao: z.string()
    .min(1, 'Duração é obrigatória')
    .regex(/^\d+(\s*-\s*\d+)?\s*(min|hora|horas)?$/i, 'Formato inválido (ex: 45 min, 1 hora, 1-2 horas)'),
  objetivos: z.string()
    .min(10, 'Objetivos devem ter pelo menos 10 caracteres')
    .max(1000, 'Objetivos devem ter no máximo 1000 caracteres')
    .optional(),
  materiais: z.string()
    .min(5, 'Materiais devem ter pelo menos 5 caracteres')
    .max(500, 'Materiais devem ter no máximo 500 caracteres')
    .optional(),
  ordem: z.number()
    .min(1, 'Ordem deve ser maior que 0')
    .max(999, 'Ordem deve ser menor que 999')
});

// Esquema para Lições Concluídas
export const licoesConcluidasPessoaSchema = z.object({
  pessoa: z.object({
    id: z.number().min(1, 'Pessoa é obrigatória')
  }),
  licoesCurriculo: z.object({
    id: z.number().min(1, 'Lição é obrigatória')
  }),
  dataConclusao: z.string()
    .min(1, 'Data de conclusão é obrigatória')
    .refine((date) => {
      const inputDate = new Date(date);
      const today = new Date();
      return inputDate <= today;
    }, 'Data de conclusão não pode ser futura'),
  observacoes: z.string()
    .min(5, 'Observações devem ter pelo menos 5 caracteres')
    .max(1000, 'Observações devem ter no máximo 1000 caracteres')
    .optional()
});

// Esquema para Presença
export const presencaSchema = z.object({
  pessoa: z.object({
    id: z.number()
      .min(1, 'Pessoa é obrigatória')
  }),
  presente: z.enum(['SIM', 'NAO', 'JUSTIFICADO'], {
    errorMap: () => ({ message: 'Status de presença deve ser SIM, NÃO ou JUSTIFICADO' })
  }),
  observacoes: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
    .or(z.literal(''))
});

// Esquema para Culto
export const cultoSchema = z.object({
  nome: z.string()
    .min(1, 'Nome do culto é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  tipo: z.enum(['DOMINGO', 'MEIO_SEMANA', 'ESPECIAL', 'JOVENS', 'MULHERES', 'HOMENS'], {
    errorMap: () => ({ message: 'Tipo deve ser DOMINGO, MEIO_SEMANA, ESPECIAL, JOVENS, MULHERES ou HOMENS' })
  }),
  dataHora: z.string()
    .min(1, 'Data e hora são obrigatórias')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Data e hora devem ser válidas'
    }),
  local: z.string()
    .min(1, 'Local é obrigatório')
    .max(100, 'Local deve ter no máximo 100 caracteres'),
  descricao: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal(''))
});

// Esquema para Acompanhamento de Estudo
export const acompanhamentoEstudoSchema = z.object({
  pessoa: z.object({
    id: z.number()
      .min(1, 'Pessoa é obrigatória')
  }),
  nivelEstudo: z.enum(['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'], {
    errorMap: () => ({ message: 'Nível deve ser INICIANTE, INTERMEDIARIO ou AVANCADO' })
  }),
  ultimaLicao: z.string()
    .max(100, 'Última lição deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  observacoes: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
    .or(z.literal(''))
});

// Esquema para Alertas
export const alertasSchema = z.object({
  pessoa: z.object({
    id: z.number()
      .min(1, 'Pessoa é obrigatória')
  }),
  tipo: z.enum(['PRESENCA', 'ESTUDO', 'BATISMO', 'GERAL'], {
    errorMap: () => ({ message: 'Tipo deve ser PRESENCA, ESTUDO, BATISMO ou GERAL' })
  }),
  titulo: z.string()
    .min(1, 'Título é obrigatório')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  descricao: z.string()
    .min(1, 'Descrição é obrigatória')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'], {
    errorMap: () => ({ message: 'Prioridade deve ser BAIXA, MEDIA, ALTA ou URGENTE' })
  }).default('MEDIA'),
  status: z.enum(['ATIVO', 'RESOLVIDO', 'ARQUIVADO'], {
    errorMap: () => ({ message: 'Status deve ser ATIVO, RESOLVIDO ou ARQUIVADO' })
  }).default('ATIVO')
});

// Esquema para Login
export const loginSchema = z.object({
  username: z.string()
    .min(1, 'Usuário é obrigatório')
    .min(3, 'Usuário deve ter pelo menos 3 caracteres'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
});

// Esquema para Registro de Usuário
export const signupSchema = z.object({
  username: z.string()
    .min(1, 'Usuário é obrigatório')
    .min(3, 'Usuário deve ter pelo menos 3 caracteres')
    .max(50, 'Usuário deve ter no máximo 50 caracteres'),
  email: z.string()
    .email('Email deve ser válido'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),
  confirmPassword: z.string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"]
});

// Função helper para criar validações do React Admin
export const createValidation = (schema) => {
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
};

// Exportar todas as validações
export const validations = {
  pessoa: createValidation(pessoaSchema),
  presenca: createValidation(presencaSchema),
  culto: createValidation(cultoSchema),
  acompanhamentoEstudo: createValidation(acompanhamentoEstudoSchema),
  alertas: createValidation(alertasSchema),
  login: createValidation(loginSchema),
  signup: createValidation(signupSchema),
  curriculoEstudo: createValidation(curriculoEstudoSchema),
  licoesCurriculo: createValidation(licoesCurriculoSchema),
  licoesConcluidasPessoa: createValidation(licoesConcluidasPessoaSchema)
}; 