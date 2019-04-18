import * as express from 'express';
import * as showsController from './libs/controllers/index';

const startServer = async () => {

  const app = express();

  app.set('port', process.env.PORT || 3000);

  app.get('/', showsController.root);
  app.get('/shows', showsController.shows);

  app.listen(3000, () => console.log('Server listening on port 3000!'));
  return app;
};

startServer();
