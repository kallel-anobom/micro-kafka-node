import express from 'express';

const routes = express.Router();

routes.post('/certifications', async (req, res) => {
  const message = {
    user: {id: 1, name: 'Tester'},
    course: 'Kafka com Node.Js',
    grade: 5 
  };

  await req.producer.send({
    topic: 'issue-certificate',
    messages: [
      { value: JSON.stringify(message) },
      { value: JSON.stringify({ ...message, user: {...message.user, name : 'Outro Tester'}}) }
    ]
  });
  
  return res.json({ ok: true });
});

export default routes;