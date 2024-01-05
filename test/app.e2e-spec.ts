import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => { //beforeAll로 바꾸면 테스트에서 한 변경사항들을 저장한다.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes( //test 에서의 환경을 기존 앱의 환경과 동일하게 맞춰야한다.
      new ValidationPipe({
        whitelist:true,
        forbidNonWhitelisted: true,
        transform: true, //요구하는 자료형으로 변환해준다. 
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect("Welcome to the movie api");
  });

  describe('/movies', () => {
    it('GET', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect([]);
    });

    it('POST 201', ()=>{
      return request(app.getHttpServer())
      .post('/movies')
      .send({
        title: 'Test',
        year: 2000,
        genres: ['test'],
      })
      .expect(201);
    });

    it('POST 400', ()=>{
      return request(app.getHttpServer())
      .post('/movies')
      .send({
        title: 'Test',
        year: 2000,
        genres: ['test'],
        other: 'thing',
      })
      .expect(400);
    });

    it("DELETE", ()=>{
      return request(app.getHttpServer()).delete("/movies").expect(404);
    });
  });

  describe('/movies/:id', ()=>{
    it('GET 200', ()=>{
      return request(app.getHttpServer()).get('/movies/1').expect(200);
    });
    it('GET 404', ()=>{
      return request(app.getHttpServer()).get('/movies/999').expect(404);
    });
    it('PATCH', ()=>{
      return request(app.getHttpServer()).patch('/movies/1').send({title: 'Updated Test'}).expect(200);
    });
    it('DELETE', ()=>{
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });
  });


});
