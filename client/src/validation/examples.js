import { z } from 'zod';
import { createConditionalValidation, useAsyncZodValidation, useZodValidation } from './useZodValidation';

// Exemplo 1: Validação condicional baseada em outro campo
export const createConditionalPessoaSchema = (values) => {
  const baseSchema = z.object({
    nomeCompleto: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    telefone: z.string().min(1, 'Telefone é obrigatório'),
    tipo: z.enum(['MEMBRO', 'VISITANTE', 'CONGREGADO'])
  });

  // Se for membro, email é obrigatório
  if (values?.tipo === 'MEMBRO') {
    return baseSchema.extend({
      email: z.string().email('Email é obrigatório para membros')
    });
  }

  return baseSchema;
};

// Exemplo 2: Validação assíncrona (verificar se email já existe)
export const createAsyncPessoaSchema = async (values) => {
  const baseSchema = z.object({
    nomeCompleto: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    telefone: z.string().min(1, 'Telefone é obrigatório')
  });

  // Se email foi fornecido, verificar se já existe
  if (values?.email) {
    try {
      // Simular chamada à API
      const response = await fetch(`/api/pessoa/check-email?email=${values.email}`);
      const exists = await response.json();
      
      if (exists) {
        return baseSchema.extend({
          email: z.string().email('Email inválido').refine(() => false, {
            message: 'Este email já está em uso'
          })
        });
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error);
    }
  }

  return baseSchema;
};

// Exemplo 3: Validação de data futura
export const presencaDataFuturaSchema = z.object({
  pessoa: z.object({
    id: z.number().min(1, 'Pessoa é obrigatória')
  }),
  presente: z.enum(['SIM', 'NAO', 'JUSTIFICADO']),
  dataPresenca: z.string()
    .refine((val) => {
      if (!val) return true;
      const data = new Date(val);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      return data <= hoje;
    }, {
      message: 'Data de presença não pode ser no futuro'
    }),
  observacoes: z.string().max(500).optional().or(z.literal(''))
});

// Exemplo 4: Validação de senha forte
export const senhaForteSchema = z.object({
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/^(?=.*[A-Z])/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/^(?=.*\d)/, 'Senha deve conter pelo menos um número')
    .regex(/^(?=.*[@$!%*?&])/, 'Senha deve conter pelo menos um caractere especial (@$!%*?&)'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"]
});

// Exemplo 5: Validação de CPF brasileiro
export const cpfSchema = z.object({
  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00')
    .refine((cpf) => {
      // Remove pontos e hífen
      const cpfLimpo = cpf.replace(/[^\d]/g, '');
      
      // Verifica se tem 11 dígitos
      if (cpfLimpo.length !== 11) return false;
      
      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
      
      // Validação do primeiro dígito verificador
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
      }
      let resto = 11 - (soma % 11);
      let dv1 = resto < 2 ? 0 : resto;
      
      // Validação do segundo dígito verificador
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
      }
      resto = 11 - (soma % 11);
      let dv2 = resto < 2 ? 0 : resto;
      
      return parseInt(cpfLimpo.charAt(9)) === dv1 && parseInt(cpfLimpo.charAt(10)) === dv2;
    }, {
      message: 'CPF inválido'
    })
});

// Exemplo 6: Validação de telefone brasileiro
export const telefoneBrasileiroSchema = z.object({
  telefone: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (00) 00000-0000')
    .refine((telefone) => {
      const numero = telefone.replace(/[^\d]/g, '');
      return numero.length === 11;
    }, {
      message: 'Telefone deve ter 11 dígitos'
    })
});

// Exemplo 7: Validação de idade mínima
export const idadeMinimaSchema = (idadeMinima = 18) => z.object({
  dataNascimento: z.string()
    .refine((val) => {
      if (!val) return true;
      const nascimento = new Date(val);
      const hoje = new Date();
      const idade = hoje.getFullYear() - nascimento.getFullYear();
      const mesAtual = hoje.getMonth();
      const mesNascimento = nascimento.getMonth();
      
      if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
        return idade - 1 >= idadeMinima;
      }
      
      return idade >= idadeMinima;
    }, {
      message: `Idade mínima deve ser ${idadeMinima} anos`
    })
});

// Exemplo 8: Validação de horário de funcionamento
export const horarioFuncionamentoSchema = z.object({
  horaInicio: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora deve estar no formato HH:MM'),
  horaFim: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora deve estar no formato HH:MM')
}).refine((data) => {
  const inicio = new Date(`2000-01-01T${data.horaInicio}:00`);
  const fim = new Date(`2000-01-01T${data.horaFim}:00`);
  return inicio < fim;
}, {
  message: "Hora de fim deve ser posterior à hora de início",
  path: ["horaFim"]
});

// Exemplo 9: Validação de arquivo de imagem
export const imagemSchema = z.object({
  imagem: z.instanceof(File)
    .refine((file) => {
      return file.size <= 5 * 1024 * 1024; // 5MB
    }, {
      message: 'Arquivo deve ter no máximo 5MB'
    })
    .refine((file) => {
      return ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
    }, {
      message: 'Arquivo deve ser uma imagem (JPEG, PNG ou GIF)'
    })
});

// Exemplo 10: Validação de array com elementos únicos
export const arrayUnicoSchema = z.object({
  tags: z.array(z.string())
    .refine((tags) => {
      const unicos = new Set(tags);
      return unicos.size === tags.length;
    }, {
      message: 'Tags devem ser únicas'
    })
    .refine((tags) => tags.length <= 10, {
      message: 'Máximo de 10 tags permitidas'
    })
});

// Hooks de exemplo para uso nos componentes
export const useConditionalPessoaValidation = () => {
  return createConditionalValidation(
    z.object({
      nomeCompleto: z.string().min(1, 'Nome é obrigatório'),
      email: z.string().email('Email inválido'),
      telefone: z.string().min(1, 'Telefone é obrigatório')
    }),
    (values) => values?.tipo === 'MEMBRO'
  );
};

export const useAsyncPessoaValidation = () => {
  return useAsyncZodValidation(createAsyncPessoaSchema);
};

export const usePresencaDataFuturaValidation = () => {
  return useZodValidation(presencaDataFuturaSchema);
};

export const useSenhaForteValidation = () => {
  return useZodValidation(senhaForteSchema);
}; 