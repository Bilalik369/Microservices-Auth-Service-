import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.model.js';

describe('Auth Service', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/auth-service-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const userData = {
        nom: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        role: 'APPRENANT'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
    });

    it('devrait rejeter un email déjà utilisé', async () => {
      const userData = {
        nom: 'Test User',
        email: 'test@example.com',
        password: 'Password123'
      };

      await request(app).post('/api/auth/register').send(userData);
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('devrait connecter un utilisateur valide', async () => {
      const user = new User({
        nom: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        role: 'APPRENANT'
      });
      await user.save();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('devrait rejeter des identifiants invalides', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});