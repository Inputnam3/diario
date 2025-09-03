const express = require('express');
const app = express();
const { Twilio } = require('twilio');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');
const { createClient } = require('@supabase/supabase-js');

// Configurações do Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSid, authToken);

// Configurações do Google Cloud (para reconhecimento de voz)
const storage = new Storage();
const speechClient = new speech.SpeechClient();

// Configurações do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Endpoint para receber o webhook do Twilio
app.post('/webhook/twilio', async (req, res) => {
  try {
    // Extrair informações do webhook
    const recordingUrl = req.body.RecordingUrl;
    const fromNumber = req.body.From;

    console.log(`Novo áudio recebido de ${fromNumber}: ${recordingUrl}`);

    // Baixar o áudio do Twilio
    const audioResponse = await fetch(recordingUrl);
    const audioBuffer = await audioResponse.buffer();

    // Salvar o áudio temporariamente (ou enviar diretamente para o Google Cloud Storage)
    const tempFileName = `temp_audio_${Date.now()}.wav`;
    fs.writeFileSync(tempFileName, audioBuffer);

    // Converter áudio em texto usando Google Speech-to-Text
    const transcription = await transcribeAudio(tempFileName);

    console.log(`Transcrição: ${transcription}`);

    // TODO: Processar o texto transcrito para identificar alimentos e quantidades
    // Por enquanto, vamos salvar a transcrição como um item de consumo
    const { data, error } = await supabase
      .from('consumptions')
      .insert([
        { user_id: fromNumber, item: transcription, consumed_at: new Date() }
      ]);

    if (error) {
      console.error('Erro ao salvar no Supabase:', error);
      res.status(500).send('Erro ao salvar no banco de dados.');
      return;
    }

    console.log('Registro salvo com sucesso:', data);

    // Responder ao Twilio (opcional)
    res.status(200).send('Áudio recebido e processado.');
  } catch (error) {
    console.error('Erro ao processar o áudio:', error);
    res.status(500).send('Erro interno do servidor.');
  }
});

// Função para transcrever áudio usando Google Speech-to-Text
async function transcribeAudio(fileName) {
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16', // Certifique-se de que o formato do áudio seja compatível
    sampleRateHertz: 16000,
    languageCode: 'pt-BR', // Idioma do áudio
  };
  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await speechClient.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcription;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});