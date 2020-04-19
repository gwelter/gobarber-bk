import express from 'express';

const app = express();

app.get('/', (request, response) => response.json({ message: 'Hello World' }));

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('Server started on port 3333');
});
