import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/user', () => {
    return new HttpResponse({ status: 200, body: { id: 1, name: 'Marcos' } });
  })
];
