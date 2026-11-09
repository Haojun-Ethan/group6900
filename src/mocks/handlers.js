// src/mocks/handlers.js

// 官方手册: https://mswjs.io/docs/basics/request-handler
import { http, HttpResponse } from 'msw';

export const handlers = [

  http.get('*/accounts/users/', () => {
    return HttpResponse.json([
      {
        id: 1,
        username: 'admin_ethan',
        email: 'admin@test.com',
        role: 'ADMIN',
        is_2fa_enabled: true,
      },
      {
        id: 2,
        username: 'owner_alex',
        email: 'owner@test.com',
        role: 'OWNER',
        is_2fa_enabled: true,
      },
      {
        id: 3,
        username: 'user_bob',
        email: 'bob@test.com',
        role: 'USER',
        is_2fa_enabled: false,
      },
    ]);
  }),

  http.patch('*/accounts/users/:id/', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, ...body });
  }),


  http.delete('*/accounts/users/:id/', () => {
    return new HttpResponse(null, { status: 204 });
  }),


  http.get('*/modules/:id/questions/', () => {
    return HttpResponse.json([
      {
        id: 101,
        module: 1,
        question_type: 'SINGLE',
        text: 'What is the primary indicator of a phishing email?',
        explanation: 'Suspicious sender addresses and urgent calls to action are classic phishing indicators.',
        points: 10,
        order: 1,
        choices: [
          { id: 1, text: 'A spoofed domain or suspicious sender address', is_correct: true, order: 1 },
          { id: 2, text: 'Proper digital signature from internal IT', is_correct: false, order: 2 },
          { id: 3, text: 'Plain text greeting without attachments', is_correct: false, order: 3 },
        ],
      },
      {
        id: 102,
        module: 1,
        question_type: 'SINGLE',
        text: 'What should you do if you receive a suspicious link via email?',
        explanation: 'Never click suspicious links; report them to security operations.',
        points: 10,
        order: 2,
        choices: [
          { id: 4, text: 'Report the email to the security team without clicking', is_correct: true, order: 1 },
          { id: 5, text: 'Click the link to verify if it is legitimate', is_correct: false, order: 2 },
          { id: 6, text: 'Forward it to all your colleagues to warn them', is_correct: false, order: 3 },
        ],
      },
    ]);
  }),


  http.post('*/modules/:id/attempts/', () => {
    return HttpResponse.json({
      id: 888,
      moduleId: 1,
      startedAt: new Date().toISOString(),
    });
  }),


  http.post('*/attempts/:attemptId/submit/', () => {
    return HttpResponse.json({
      id: 888,
      scorePercent: 100,
      passed: true,
      userAnswers: { 101: 1, 102: 4 },
    });
  }),


  http.get('*/attempts/:attemptId/', () => {
    return HttpResponse.json({
      id: 888,
      scorePercent: 100,
      passed: true,
      userAnswers: { 101: 1, 102: 4 },
    });
  }),
];