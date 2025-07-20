import { z } from 'zod';
import './zodConfig';

// Teste das mensagens de validação em português
export const testValidationMessages = () => {
  console.log('=== Teste de Mensagens de Validação em Português ===');

  // Teste 1: Campo obrigatório
  const requiredSchema = z.object({
    nome: z.string()
  });

  try {
    requiredSchema.parse({});
  } catch (error) {
    console.log('Campo obrigatório:', error.errors[0].message);
  }

  // Teste 2: Email inválido
  const emailSchema = z.object({
    email: z.string().email()
  });

  try {
    emailSchema.parse({ email: 'email-invalido' });
  } catch (error) {
    console.log('Email inválido:', error.errors[0].message);
  }

  // Teste 3: String muito pequena
  const minLengthSchema = z.object({
    nome: z.string().min(5)
  });

  try {
    minLengthSchema.parse({ nome: 'abc' });
  } catch (error) {
    console.log('String muito pequena:', error.errors[0].message);
  }

  // Teste 4: String muito grande
  const maxLengthSchema = z.object({
    nome: z.string().max(3)
  });

  try {
    maxLengthSchema.parse({ nome: 'abcdef' });
  } catch (error) {
    console.log('String muito grande:', error.errors[0].message);
  }

  // Teste 5: Enum inválido
  const enumSchema = z.object({
    status: z.enum(['ATIVO', 'INATIVO'])
  });

  try {
    enumSchema.parse({ status: 'PENDENTE' });
  } catch (error) {
    console.log('Enum inválido:', error.errors[0].message);
  }

  // Teste 6: Número muito pequeno
  const minNumberSchema = z.object({
    idade: z.number().min(18)
  });

  try {
    minNumberSchema.parse({ idade: 15 });
  } catch (error) {
    console.log('Número muito pequeno:', error.errors[0].message);
  }

  // Teste 7: Data inválida
  const dateSchema = z.object({
    data: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Data inválida'
    })
  });

  try {
    dateSchema.parse({ data: 'data-invalida' });
  } catch (error) {
    console.log('Data inválida:', error.errors[0].message);
  }

  console.log('=== Fim dos Testes ===');
};

// Função para testar um esquema específico
export const testSchema = (schema, data) => {
  try {
    const result = schema.parse(data);
    console.log('✅ Validação passou:', result);
    return { success: true, data: result };
  } catch (error) {
    console.log('❌ Erros de validação:');
    error.errors.forEach((err, index) => {
      console.log(`${index + 1}. Campo: ${err.path.join('.')} - ${err.message}`);
    });
    return { success: false, errors: error.errors };
  }
};

// Exemplo de uso
if (typeof window !== 'undefined') {
  // Executar testes apenas no browser
  window.testValidationMessages = testValidationMessages;
  window.testSchema = testSchema;
} 

// Teste de validação para culto recorrente
import { cultoRecorrenteSchema } from './schemas';

// Teste de validação de hora
const testHoraValidation = () => {
  console.log('=== Teste de Validação de Hora ===');
  
  const testCases = [
    '19:30',
    '09:15',
    '23:59',
    '00:00',
    '7:30',
    '19:30:00',
    '25:00', // inválido
    '19:60', // inválido
    '19', // inválido
    '19:30:45', // válido
    ''
  ];

  testCases.forEach(hora => {
    try {
      const result = cultoRecorrenteSchema.shape.hora.parse(hora);
      console.log(`✅ "${hora}" - VÁLIDO`);
    } catch (error) {
      console.log(`❌ "${hora}" - INVÁLIDO: ${error.message}`);
    }
  });
};

// Teste completo do schema
const testCompleteSchema = () => {
  console.log('\n=== Teste Completo do Schema ===');
  
  const validData = {
    titulo: 'Culto de Domingo',
    hora: '19:30',
    local: 'Templo Principal',
    descricao: 'Culto dominical',
    pregador: 'Pr. João',
    status: 'Agendado',
    observacoes: 'Observações do culto',
    diaSemana: 'DOMINGO',
    dataInicio: '2025-01-01',
    dataFim: '2025-12-31',
    ativo: true
  };

  try {
    const result = cultoRecorrenteSchema.parse(validData);
    console.log('✅ Schema válido:', result);
  } catch (error) {
    console.log('❌ Erro no schema:', error.errors);
  }
};

// Executar testes
if (typeof window !== 'undefined') {
  // Executar no browser
  window.testHoraValidation = testHoraValidation;
  window.testCompleteSchema = testCompleteSchema;
  
  console.log('Testes disponíveis:');
  console.log('- testHoraValidation()');
  console.log('- testCompleteSchema()');
}

export { testCompleteSchema, testHoraValidation };
