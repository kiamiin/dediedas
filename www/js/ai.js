// Replace with your own free key from https://platform.moonshot.ai/console/api-keys
const KIMI_KEY = 'sk-8q1fgY1uf4VLmYs0Pvh6OzQRbmuqAKeYEtPhqcaAYLeCPGbO';

const el = id => document.getElementById(id);
let correct;

async function loadQuiz() {
  const res = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KIMI_KEY}`
    },
    body: JSON.stringify({
      model: 'kimi-k2-0711-preview',
      messages: [
        {
          role: 'system',
          content:
            'Return only JSON of the form {"q":"Translate the German name ___ to English","a":"correct","opt":["opt1","opt2","opt3","correct"],"img":"https://image-url.jpg"}. Pick a random German first name and supply a royalty-free 300×300 image from Unsplash/Pexels/WikiMedia.'
        }
      ],
      temperature: 0.6,
      max_tokens: 200
    })
  });

  const data = (await res.json()).choices[0].message.content.trim();
  const quiz = JSON.parse(data);

  el('q').textContent = quiz.q;
  el('pic').src = quiz.img;
  const opts = quiz.opt.sort(() => Math.random() - 0.5);
  ['b1', 'b2', 'b3', 'b4'].forEach((id, idx) => {
    el(id).textContent = opts[idx];
    el(id).onclick = () => alert(opts[idx] === quiz.a ? '✅' : '❌');
  });
}

loadQuiz();