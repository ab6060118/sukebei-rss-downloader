import Express from 'express';
import engine from 'ejs-locals';
import config from './config';
import { fetchPosts, postDownload } from './libs/posts';

const app = Express();
app.engine('ejs', engine);
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const posts = await fetchPosts();

  res.render('index', {
    posts,
  });
});

app.post('/download/:number', async (req, res) => {
  const { number } = req.params;
  const download = await postDownload(number);

  console.log(download);

  res.send({
    data: download,
  });
});

app.listen(config.servicePort);
