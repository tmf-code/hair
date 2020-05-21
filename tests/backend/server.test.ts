import { makeProductionServer } from '../../backend/src/server';
import request from 'supertest';

describe('Production server can be created', () => {
  test('It should response the GET method', (done) => {
    const server = makeProductionServer()
      .on('error', () => {
        request('http://localhost:3000').get('/').expect(200);
        done();
      })
      .on('listening', () => {
        request(server).get('/').expect(200);
        done();
      });
  });
});
