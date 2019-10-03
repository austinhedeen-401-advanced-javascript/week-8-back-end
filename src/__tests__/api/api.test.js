'use strict';

const {server} = require('../../../src/app');
const supergoose = require('../supergoose.js');
const mockRequest = supergoose.server(server);

beforeAll(async (done) => {
  await supergoose.startDB();
  done();
});

afterAll(supergoose.stopDB);

describe('Todo API', () => {

  const endpoint = '/api/v1/todo/';
  const testTodo = {
    title: 'Todo 1',
    content: 'A simple todo',
  };
  const testTodoTwo = {
    title: 'Todo 2',
    content: 'Another todo',
  };
  const updateContent = {
    content: 'Updated content!',
  };
  let todoOneId;

  test('Creating a new todo should return 200 and the created object', () => {
    return mockRequest
      .post(endpoint)
      .send(testTodo)
      .then(response => {
        todoOneId = response.body._id;
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(testTodo.title);
      });
  });

  test('Fetching a todo should return 200 and the object', () => {
    return mockRequest.get(endpoint + todoOneId).send()
      .then(response => {
        todoOneId = response.body._id;
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(testTodo.title);
      });
  });

  test('Fetching all todos should return 200 and the array of saved objects', () => {
    return mockRequest.get(endpoint).send()
      .then(response => {
        expect(response.status).toEqual(200);
        const results = response.body;
        expect(results[0]._id).toEqual(todoOneId);

        return mockRequest.post(endpoint).send(testTodoTwo);
      })
      .then(() => mockRequest.get(endpoint).send())
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(2);
      });
  });

  test('Updating a todo should return 200 and the updated object', () => {
    return mockRequest.put(endpoint + todoOneId).send(updateContent)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.content).toEqual(updateContent.content);
      });
  });

  test('Deleting a todo should return 200 and the deleted object', () => {
    return mockRequest.delete(endpoint + todoOneId).send()
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(testTodo.title);
      });
  });

});
