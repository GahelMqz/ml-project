import axios from 'axios'

export const sendPrediction = async (payload: unknown) => {
  try {
    const response = await axios.post('http://localhost:5000/predict/lung_cancer_survival', payload)
    return response.data
  } catch (error) {
    console.error('Error al enviar la predicción:', error)
    throw error
  }
}
