const superagent = require('supertest');
const app = require('../app');
const request = superagent(app.listen());

describe('get js ticket', function () {
    it('should be healthy', function (done) {
        request.get('/healthcheck')
            .send({})
            .expect(200, /\"everything\"\:\"is ok\"/, done)
            ;
    });

    it('should get js ticket', function (done) {
        request.get('/js-ticket/buzz')
            .send({})
            .expect(200, {}, done)
            ;
    });
});