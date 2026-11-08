// src/mocks/handlers.js

// 官方手册: https://mswjs.io/docs/basics/request-handler
import { http, HttpResponse } from 'msw';
import * as quizMock from './quizMock';

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


  // Quiz endpoints, same paths and shapes as the Django backend (see src/mocks/quizMock.js).
  http.get('*/questions/', ({ request }) => {
    return HttpResponse.json(quizMock.listQuestions(new URL(request.url).searchParams.get('module')));
  }),

  http.post('*/attempts/', async ({ request }) => {
    const body = await request.json();
    const { status, body: data } = quizMock.startAttempt(body?.module);
    return HttpResponse.json(data, { status });
  }),

  http.post('*/attempts/:attemptId/submit/', async ({ request, params }) => {
    const { status, body } = quizMock.submitAttempt(params.attemptId, await request.json());
    return HttpResponse.json(body, { status });
  }),

  http.get('*/attempts/:attemptId/', ({ params }) => {
    const { status, body } = quizMock.getAttempt(params.attemptId);
    return HttpResponse.json(body, { status });
  }),
];