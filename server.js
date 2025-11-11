const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const app = express();

app.use(express.json());
app.use(cors());

const PASSWORD = process.env.PASSWORD || 'mein_passwort_123';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/chat', async (req, res) => {
  if (req.headers.authorization !== `Bearer ${PASSWORD}`) {
    return res.status(401).json({ error: 'Falsches Passwort' });
  }
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Keine Nachricht' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }]
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: 'Fehler' });
  }
});

app.listen(process.env.PORT || 3000);
