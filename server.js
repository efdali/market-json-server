const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const data = require('./db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get('/companies', (req, res) => {
  const companies = data.companies.map((company) => {
    const count = data.items.reduce((acc, current) => {
      if (current.manufacturer === company.slug) {
        acc++;
      }
      return acc;
    }, 0);

    return { ...company, count };
  });

  res.jsonp(companies);
});

server.get('/tags', (req, res) => {
  const uniqueTags = [
    ...new Set(data.items.reduce((arr, item) => arr.concat(item.tags), [])),
  ];

  const tags = uniqueTags.map((tag) => {
    const count = data.items.reduce((acc, current) => {
      if (current.tags.includes(tag)) {
        acc++;
      }
      return acc;
    }, 0);

    return {
      slug: tag,
      name: tag,
      count,
    };
  });

  res.jsonp(tags);
});

server.use(router);

server.listen(process.env.PORT || 3004, () => {
  console.log('JSON Server is running');
});
