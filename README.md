# Sample customers API

A sample for practice.

# APIs

## List all people

```
GET https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people
```

## Get a person data

```
GET https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people/:id
```

## Add new person

```
POST https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people

{ "name": "name", "email": "email@email.com", "status": "Active" }
```

## Update a person

```
PUT https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people/:id

{ "nickname": "Dude", "street": "Street X" }
```

## Remove a lote of people

```
DELETE https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people

[
  { "id": 12345 },
  { "id": 67890 }
]
```

## Remove a person

```
DELETE https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people/:id
```
