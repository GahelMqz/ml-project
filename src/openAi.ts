// src/services/openaiService.ts
import axios from 'axios'

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY // ✅ Usa variables de entorno

export const askLLM = async (prompt: string): Promise<string> => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo', // o 'gpt-3.5-turbo'
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  )
  return response.data.choices[0].message.content
}

export const buildMedicalPrompt = (userInput: string, questionKey: string): string => {
  // 🎯 Define las posibles categorías (solo para campos enum y boolean)
  const categorias: Record<string, string[]> = {
    gender: ['Male', 'Female'],
    smoking_status: ['Never Smoked', 'Passive Smoker', 'Former Smoker', 'Current Smoker'],
    treatment_type: ['Chemotherapy', 'Surgery', 'Combined', 'Radiation'],
    cancer_stage: ['Stage I', 'Stage II', 'Stage III', 'Stage IV'],
    hasCancer: ['Yes', 'No'],
    family_history: ['Yes', 'No'],
    hypertension: ['Yes', 'No'],
    asthma: ['Yes', 'No'],
    cirrhosis: ['Yes', 'No'],
    other_cancer: ['Yes', 'No'],
  }

  const booleanFields = Object.keys(categorias).filter((key) => categorias[key].includes('Yes'))
  const numberFields = ['age', 'bmi', 'cholesterol_level', 'height', 'weight']
  const stringFields = ['country']
  const dateFields = ['diagnosis_date', 'end_treatment_date']

  // 👨‍⚕️ Prompt especializado por tipo
  if (booleanFields.includes(questionKey)) {
    return `
Eres un asistente médico que interpreta respuestas del paciente en español y devuelve una clasificación clínica en inglés.

Respuesta del paciente: "${userInput}"

Campo: "${questionKey}"

Devuelve **solo** uno de estos valores: Yes, No
No agregues texto adicional.
`.trim()
  }

  // 🚬 PROMPT MEJORADO Y DETALLADO PARA SMOKING_STATUS
  if (questionKey === 'smoking_status') {
    return `
Eres un asistente médico especializado en clasificar el estado de fumador de pacientes. Analiza la respuesta del usuario y clasifica su smoking_status en UNA de estas categorías exactas:

Respuesta del paciente: "${userInput}"

CATEGORÍAS Y CRITERIOS:

**Never Smoked** (0):
- Nunca ha fumado cigarrillos
- No está expuesto regularmente al humo de segunda mano
- Respuestas como: "Nunca he fumado", "No fumo ni huelo a humo", "Jamás he probado un cigarro"

**Passive Smoker** (1):
- No fuma directamente pero está expuesto al humo de segunda mano
- Huele a humo frecuentemente por otros fumadores cerca
- Respuestas como: "No fumo pero huelo a humo a veces", "Mi pareja fuma", "Trabajo donde hay fumadores"

**Former Smoker** (2):
- Fumó cigarrillos en el pasado pero YA NO fuma actualmente
- Puede mencionar cantidad específica del pasado
- Respuestas como: "Fumaba 10 cigarrillos hace 5 años pero dejé", "Ex-fumador", "Dejé de fumar hace tiempo"

**Current Smoker** (3):
- Fuma cigarrillos ACTIVAMENTE en la actualidad
- Reporta cantidad actual de cigarrillos por día/semana
- Respuestas como: "Fumo 5 cigarrillos al día", "A veces fumo", "Soy fumador", "Fumo diariamente"

FACTORES CLAVE A ANALIZAR:
- Cantidad de cigarrillos (actual vs pasada)
- Exposición al humo (propia vs ajena)
- Frecuencia temporal (nunca, antes, a veces, diario)
- Contexto (trabajo, pareja, propio hábito)

Devuelve SOLO una de estas opciones exactas: Never Smoked, Passive Smoker, Former Smoker, Current Smoker

No agregues explicaciones ni texto adicional.
`.trim()
  }

  if (categorias[questionKey]) {
    const opciones = categorias[questionKey]
    return `
Eres un asistente médico encargado de clasificar respuestas del paciente en categorías clínicas estructuradas.

Respuesta del paciente: "${userInput}"

Clasifica esta respuesta en una sola categoría correspondiente al campo: "${questionKey}"

Posibles categorías para "${questionKey}": ${opciones.join(', ')}

Devuelve **solo** una de las categorías exactamente como aparece en la lista. No expliques ni añadas texto adicional.
`.trim()
  }

  if (numberFields.includes(questionKey)) {
    return `
Eres un asistente médico que extrae valores numéricos clínicos de respuestas del paciente.

Respuesta del paciente: "${userInput}"

Extrae el número correspondiente al campo: "${questionKey}"

- Si el paciente responde "no se" o deja vacío:
   • Para cholesterol_level: devuelve 202.5
   • Para height o weight: vuelve a preguntar al paciente

- Si el paciente responde mas de 200 para height volver a preguntar
- Si el paciente responde mas de 500 o menos de 20 para weight volver a preguntar

Devuelve solo el número, sin texto adicional.
`.trim()
  }

  if (stringFields.includes(questionKey)) {
    return `
Eres un asistente médico que extrae el nombre del país a partir de respuestas del paciente.

Respuesta del paciente: "${userInput}"

Devuelve **solo** el país mencionado, sin explicaciones ni texto adicional.
`.trim()
  }

  if (dateFields.includes(questionKey)) {
    return `
Eres un asistente médico que extrae fechas de diagnóstico o tratamiento del paciente.

Respuesta del paciente: "${userInput}"

Devuelve la fecha unicamente en formato DD/MM/YYYY.
No agregues texto adicional.
`.trim()
  }

  // 🧯 Fallback
  throw new Error(`Categoría desconocida: ${questionKey}`)
}
