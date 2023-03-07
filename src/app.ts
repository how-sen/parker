import server from './server';

(async () => {
    try {
      const app = new server();
      const port = parseInt(process.env.PORT || '4000');
      await app.start(port);
      console.log(`Running on port ${port}`);
    } catch (error) {
      console.error(error);
    }
})();