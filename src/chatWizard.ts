// src/services/chatWizard.ts
//import { sendPrediction } from './predictService.ts'
import { askLLM, buildMedicalPrompt } from '@/openAi'

export interface PatientData {
  smoking_status: number
  family_history: number
  bmi: number
  cholesterol_level: number
  asthma: number
  hypertension: number
  cirrhosis: number
  other_cancer: number
  age: number
  gender: number
  country: string
  treatment_type?: number
  cancer_stage?: number
  diagnosis_date?: string
  end_treatment_date?: string
}
type Question =
  | { key: string; text: string; type: 'boolean' }
  | { key: string; text: string; type: 'number' }
  | { key: string; text: string; type: 'string' }
  | { key: string; text: string; type: 'date' }
  | { key: string; text: string; type: 'enum'; values: string[] }
const questions: Question[] = [
  { key: 'hasCancer', text: '¿Actualmente tienes diagnóstico de cáncer de pulmón?', type: 'boolean' },
  { key: 'age', text: '¿Cuál es tu edad?', type: 'number' },
  { key: 'gender', text: '¿Cuál es tu sexo biológico? (Masculino/Femenino)', type: 'enum', values: ['Male', 'Female'] },
  { key: 'country', text: '¿En qué país resides?', type: 'string' },
  { key: 'family_history', text: '¿Tienes antecedentes familiares de cáncer pulmonar?', type: 'boolean' },
  { key: 'smoking_status', text: '¿Cuál es tu situación como fumador?', type: 'enum', values: ['Never Smoked', 'Passive Smoker', 'Former Smoker', 'Current Smoker'] },
  { key: 'bmi', text: '¿Cuál es tu índice de masa corporal (IMC)?', type: 'number' },
  { key: 'cholesterol_level', text: '¿Cuál es tu nivel de colesterol?', type: 'number' },
  { key: 'hypertension', text: '¿Tienes hipertensión?', type: 'boolean' },
  { key: 'asthma', text: '¿Sufres de asma?', type: 'boolean' },
  { key: 'cirrhosis', text: '¿Tienes cirrosis hepática?', type: 'boolean' },
  { key: 'other_cancer', text: '¿Has tenido algún otro tipo de cáncer?', type: 'boolean' },
  { key: 'treatment_type', text: '¿Cuál fue el tratamiento recibido?', type: 'enum', values: ['Chemotherapy', 'Surgery', 'Combined', 'Radiation'] },
  { key: 'cancer_stage', text: '¿En qué etapa fue diagnosticado el cáncer?', type: 'enum', values: ['Stage I', 'Stage II', 'Stage III', 'Stage IV'] },
  { key: 'diagnosis_date', text: '¿Cuál fue la fecha de diagnóstico? (DD/MM/YYYY)', type: 'date' },
  { key: 'end_treatment_date', text: '¿Cuál fue la fecha de finalización del tratamiento? (DD/MM/YYYY)', type: 'date' }
]
export const useChatWizard = () => {
  let step = 0
  const data: Partial<PatientData> & { hasCancer?: boolean } & { [key: string]: string | number | boolean | undefined } = {}
  let completedJson: PatientData | null = null

// 🎯 Validador de rangos médicos - NUEVA FUNCIONALIDAD
const validateMedicalRange = (value: number, field: string): { isValid: boolean; warning?: string } => {
  const ranges: Record<string, { min: number; max: number; unit: string }> = {
    age: { min: 0, max: 120, unit: 'años' },
    bmi: { min: 10, max: 60, unit: 'kg/m²' },
    cholesterol_level: { min: 100, max: 400, unit: 'mg/dL' }
  }

  const range = ranges[field]
  if (!range) return { isValid: true }

  if (value < range.min || value > range.max) {
    return {
      isValid: false,
      warning: `⚠️ Valor fuera del rango médico esperado (${range.min}-${range.max} ${range.unit}). ¿Estás seguro?`
    }
  }

  return { isValid: true }
}

// 🔍 Detección de inconsistencias - NUEVA FUNCIONALIDAD
const detectInconsistencies = (currentKey: string, value: string | number | boolean): string | null => {
  // Detectar inconsistencias lógicas
  if (currentKey === 'bmi' && typeof value === 'number') {
    if (data.age && data.age < 18 && value > 30) {
      return '🤔 Un IMC alto en menores de edad es poco común. ¿Podrías verificar?'
    }
  }

  if (currentKey === 'smoking_status' && value === 'Current Smoker') {
    if (data.age && data.age < 16) {
      return '⚠️ Fumador activo a edad temprana. ¿Podrías confirmar?'
    }
  }

  if (currentKey === 'family_history' && value === 1) {
    return '💡 Sugerencia: Si tienes antecedentes familiares, considera revisiones médicas más frecuentes.'
  }

  return null
}


const getCurrentQuestion = (): string | null => {
  return questions[step]?.key ?? null
}
// 🎯 NUEVA: Mapeos clínicos estructurados
const clinicalMappings = {
  smoking_status: {
    'Never Smoked': 0,
    'Passive Smoker': 1,
    'Former Smoker': 2,
    'Current Smoker': 3
  },
  gender: {
    'Male': 0,
    'Female': 1
  },
  treatment_type: {
    'Chemotherapy': 0,
    'Surgery': 1,
    'Combined': 2,
    'Radiation': 3
  },
  cancer_stage: {
    'Stage I': 1,
    'Stage II': 2,
    'Stage III': 3,
    'Stage IV': 4
  }
}

const booleanFields = ['family_history', 'asthma', 'cirrhosis', 'other_cancer', 'hypertension', 'hasCancer']

const mapClinicalValue = (field: string, value: string): number | string | null => {
  // 🔢 Mapeo para campos enum con valores numéricos
  if (clinicalMappings[field as keyof typeof clinicalMappings]) {
    const mapping = clinicalMappings[field as keyof typeof clinicalMappings]
    const mappedValue = mapping[value as keyof typeof mapping]

    if (mappedValue !== undefined) {
      return mappedValue
    }

    console.warn(`⚠️ Valor inesperado para ${field}: "${value}". Valores esperados: ${Object.keys(mapping).join(', ')}`)
    return null
  }

  // ✅ Mapeo para campos boolean
  if (booleanFields.includes(field)) {
    if (value === 'Yes') return 1
    if (value === 'No') return 0
    console.warn(`⚠️ Valor inesperado para campo boolean ${field}: "${value}". Esperado: Yes/No`)
    return null
  }

  // 📝 Para campos string/date/number, devolver tal cual
  return value
}

const interpretAnswer = async (input: string): Promise<string | number | boolean | null> => {
  const question = questions[step]
  const { type, key } = question

  try {
    // 🤖 Usar LLM para TODOS los tipos de datos (más consistente)
    switch (type) {
      case 'enum':
      case 'boolean':
      case 'number':
      case 'string':
      case 'date': {
        const prompt = buildMedicalPrompt(input, key)
        const modelOutput = await askLLM(prompt)
        const rawValue = modelOutput.trim()

        // 🔄 Post-procesamiento específico por tipo
        if (type === 'number') {
          const numValue = parseFloat(rawValue)
          if (isNaN(numValue)) return null

          // ✅ Validación de rangos médicos
          const validation = validateMedicalRange(numValue, key)
          if (!validation.isValid) {
            console.warn(validation.warning)
          }

          return numValue
        }

        // 🎯 NUEVA: Aplicar mapeos clínicos estructurados
        const mappedValue = mapClinicalValue(key, rawValue)
        return mappedValue
      }

      default:
        return null
    }
  } catch (error) {
    console.error('Error al interpretar respuesta con LLM:', error)

    // 🔄 Fallback local solo en caso de error del LLM
    if (type === 'boolean') {
      const lower = input.toLowerCase().trim()
      if (['si', 'sí', 'yes'].some(v => lower.includes(v))) return 1
      if (['no'].some(v => lower.includes(v))) return 0
    }

    return null
  }
}

  const cancerDependentFields = [
  'treatment_type',
  'cancer_stage',
  'diagnosis_date',
  'end_treatment_date'
]

const shouldSkip = (key: string): boolean => {
  return cancerDependentFields.includes(key) && data.hasCancer === false
}

  const nextQuestion = (): string | null => {
    while (step < questions.length && shouldSkip(questions[step].key)) {
      step++
    }
    return step < questions.length ? questions[step].text : null
  }

  const advanceStep = () => step++

  const handleResponse = async (userInput: string): Promise<string> => {
  const value = await interpretAnswer(userInput)

  // Si la interpretación no fue clara, personalizamos el mensaje según el tipo de pregunta
  if (value === null || value === 'indefinido') {
    const key = questions[step].key

    // Mensajes específicos para campos sensibles
    if (key === 'family_history') {
      return 'Tu respuesta no fue clara. ¿Podrías confirmar si tienes antecedentes familiares de cáncer pulmonar?'
    }

    if (key === 'smoking_status') {
      return 'No se pudo determinar tu situación como fumador. ¿Te consideras fumador activo, exfumador, pasivo o nunca has fumado? Puedes describir cuántos cigarrillos fumas al día si lo prefieres.'
    }

    return `No entendí tu respuesta. ${questions[step].text}`
  }

  const key = questions[step].key
  const processedValue = key === 'hasCancer' ? value === 1 : value

  // ✅ NUEVA: Detección de inconsistencias médicas
  const inconsistencyWarning = detectInconsistencies(key, processedValue)

  // Guardar el valor
  data[key] = processedValue

  advanceStep()
  const nextQ = nextQuestion()

  // 🎯 NUEVA: Agregar warnings a la respuesta si los hay
  let response = nextQ ?? finishWizard()

  if (inconsistencyWarning) {
    response = `${inconsistencyWarning}\n\n${response}`
  }

  return response
}
  // 🎯 NUEVA: Generar sugerencias contextuales basadas en respuestas previas
  const generateContextualSuggestion = (): string => {
    const suggestions = []

    // Convertir smoking_status string a comparación válida
    const smokingStatus = data.smoking_status as unknown as string
    if (smokingStatus === 'Current Smoker' || smokingStatus === 'Former Smoker') {
      suggestions.push('💡 Considera programas de cesación tabáquica')
    }

    if (data.family_history === 1) {
      suggestions.push('🩺 Recomendamos exámenes regulares por antecedentes familiares')
    }

    if (typeof data.bmi === 'number' && data.bmi > 30) {
      suggestions.push('⚖️ Un IMC saludable puede reducir riesgos de cáncer')
    }

    if (data.hypertension === 1 && data.asthma === 1) {
      suggestions.push('🫁 La combinación de hipertensión y asma requiere seguimiento médico')
    }

    return suggestions.length > 0 ? `\n\n${suggestions.join('\n')}` : ''
  }

  const finishWizard = (): string => {
  // ✅ Validación mejorada de campos obligatorios
  const obligatorios = ['smoking_status', 'age', 'gender', 'country']

  for (const campo of obligatorios) {
    if (data[campo] === undefined || data[campo] === null) {
      return `Falta completar el campo obligatorio: ${campo}`
    }
  }

  // ✅ Validación condicional para campos de cáncer
  if (data.hasCancer === true) {
    const cancerFields = ['treatment_type', 'cancer_stage', 'diagnosis_date', 'end_treatment_date']

    for (const campo of cancerFields) {
      if (data[campo] === undefined || data[campo] === null) {
        return `Falta completar el campo relacionado con diagnóstico: ${campo}`
      }
    }
  }

  // 🎯 Construcción del JSON final con campos condicionales
  const finalJson: PatientData = {
    smoking_status: data.smoking_status as number,
    family_history: (data.family_history as number) ?? 0,
    bmi: (data.bmi as number) ?? 0,
    cholesterol_level: (data.cholesterol_level as number) ?? 0,
    asthma: (data.asthma as number) ?? 0,
    hypertension: (data.hypertension as number) ?? 0,
    cirrhosis: (data.cirrhosis as number) ?? 0,
    other_cancer: (data.other_cancer as number) ?? 0,
    age: data.age as number,
    gender: data.gender as number,
    country: data.country as string
  }

  // ✅ Solo incluir campos de cáncer si hasCancer = true
  if (data.hasCancer === true) {
    finalJson.treatment_type = data.treatment_type as number
    finalJson.cancer_stage = data.cancer_stage as number
    finalJson.diagnosis_date = data.diagnosis_date as string
    finalJson.end_treatment_date = data.end_treatment_date as string
  }

  completedJson = finalJson

  // ✅ Agregar sugerencias contextuales al final
  const suggestions = generateContextualSuggestion()
  return `✅ Información procesada correctamente.${suggestions}`
}

  const getResult = (): PatientData | null => completedJson

  const resetWizard = () => {
    step = 0
    Object.keys(data).forEach(k => delete data[k])
    completedJson = null
  }

  return {
    nextQuestion,
    handleResponse,
    getResult,
    resetWizard,
    getCurrentQuestion
  }
}
