const db = require('../../db/db');

const urlApiBase = '/api/thf-samples/v1/people';

const startPage = (page = 1, pageSize = 10) => (page - 1) * pageSize;
const endPage = (page, pageSize) => startPage(page, pageSize) + pageSize;

const select = table => db[table];
const like = (records, field, value) => records.filter(record => record[field] && record[field].toLocaleLowerCase().includes(value.toLocaleLowerCase()));
const find = (records, field, value) => records.find(record => record[field] === value);

const removeDuplicates = records => records.filter((record, index, self) =>
  index === self.findIndex(r => (
    r.place === record.place && r.id === record.id
  ))
);

const dateOptions = {
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric', second: 'numeric',
  hour12: false
};
const currencyDate = () => new Intl.DateTimeFormat('pt-BR', dateOptions).format(new Date());

const responseMsg = (code, message, detailedMessage) => ({ code, message, detailedMessage });
const errorGetNotFound = (resource) => responseMsg(404, `${resource} not found.`, `${resource} not found in database.`);

const log = msg => console.log(`${currencyDate()}:`, msg);

module.exports  = function(app) {
  app.get(`${urlApiBase}`, (req, res) => {
    log(`GET ${req.url}`); log(req.query);

    const page = +req.query.page || 1;
    const pageSize = +req.query.pageSize || 10;

    const start = startPage(page, pageSize);
    const end = endPage(page, pageSize);

    let records = select('people');

    if (req.query.search) {
      records = [
        ...like(records, 'name', req.query.search),
        ...like(records, 'nickname', req.query.search),
        ...like(records, 'email', req.query.search),
        ...like(records, 'city', req.query.search),
        ...like(records, 'genre', req.query.search)
      ];

      records = removeDuplicates(records);
    }

    if (req.query.name) { records = like(records, 'name', req.query.name); }
    if (req.query.nickname) { records = like(records, 'nickname', req.query.nickname); }
    if (req.query.email) { records = like(records, 'email', req.query.email); }
    if (req.query.city) { records = like(records, 'city', req.query.city); }
    if (req.query.genre) { records = like(records, 'genre', req.query.genre); }

    if (req.query.status) {
      let recordsWithStatus = [];

      req.query.status.split(',').forEach(status => {
        recordsWithStatus = [...recordsWithStatus, ...like(records, 'status', status)]
      });

      records = recordsWithStatus;
    }

    const hasNext = records.length > end;

    records = [... records.slice(start, end)];

    records = records.map(person => ({
      id: person.id,
      name: person.name,
      birthdate: person.birthdate,
      genre: person.genre,
      city: person.city,
      status: person.status,
      nickname: person.nickname,
      email: person.email}));

    res.send({
      hasNext: hasNext,
      items: records
    });
  });

  app.get(`${urlApiBase}/:id`, (req, res) => {
    log(`GET ${req.url}`); log(req.params);

    const people = select('people');
    const person = find(people, 'id', +req.params.id);

    if (person) {
      res.send(person);
    } else {
      res.status(404).send(errorGetNotFound(`Person`));
    }
  });

  app.all('/*', function(req, res) {
    log(`* ${req.url}`); log(req.params); log(req.query); log(req.body);

    res.status(400).send(responseMsg(400, 'Bad Request.', 'Invalid endpoint.'));
  });
};
