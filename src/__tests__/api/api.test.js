'use strict';

const {server} = require('../../../src/app');
const supergoose = require('../supergoose.js');
const mockRequest = supergoose.server(server);

beforeAll(async (done) => {
  await supergoose.startDB();
  done();
});

afterAll(supergoose.stopDB);

describe('Image API', () => {

  const endpoint = '/api/v1/image/';
  const testImage = {
    url: 'http://example.com/1',
    title: 'Title 1',
    description: 'Description 1',
  };
  const testImageTwo = {
    url: 'http://example.com/2',
    title: 'Title 2',
    description: 'Description 2',
  };
  const updateContent = {
    description: 'Updated description!',
  };
  let imageOneId;

  test('Creating a new image should return 200 and the created object', () => {
    return mockRequest
      .post(endpoint)
      .send(testImage)
      .then(response => {
        imageOneId = response.body._id;
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(testImage.title);
      });
  });

  test('Fetching an image should return 200 and the object', () => {
    return mockRequest.get(endpoint + imageOneId).send()
      .then(response => {
        imageOneId = response.body._id;
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(testImage.title);
      });
  });

  test('Fetching all images should return 200 and the array of saved objects', () => {
    return mockRequest.get(endpoint).send()
      .then(response => {
        expect(response.status).toEqual(200);
        const results = response.body;
        expect(results[0]._id).toEqual(imageOneId);

        return mockRequest.post(endpoint).send(testImageTwo);
      })
      .then(() => mockRequest.get(endpoint).send())
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(2);
      });
  });

  test('Updating an image should return 200 and the updated object', () => {
    return mockRequest.put(endpoint + imageOneId).send(updateContent)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.description).toEqual(updateContent.description);
      });
  });

  test('Deleting an image should return 200 and the deleted object', () => {
    return mockRequest.delete(endpoint + imageOneId).send()
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(testImage.title);
      });
  });

});
