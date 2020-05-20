import { makeProductionServer } from '../../backend/src/server';
import request from 'supertest';

describe('Production server can be created', () => {
  const server = makeProductionServer();
  test('It should response the GET method', () => {
    return request(server).get('/').expect(200);
  });
});
