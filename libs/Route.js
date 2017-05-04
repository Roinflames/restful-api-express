import userRoute from '../routes/user';
import authRoute from '../routes/auth'
import deviceRoute from '../routes/device'
import accuRoute from '../routes/accuweather'

const routes = [{
  path: '/api/user',
  file: userRoute
  },{
  path: '/api/auth',
  file: authRoute
},{
  path: '/api/device',
  file: deviceRoute
},{
  path: '/api/accu',
  file: accuRoute
},

];

export default (app) => {
  routes.forEach((router) => app.use(router.path, router.file));
};
