import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'checkout',
    renderMode: RenderMode.Client
  },
  {
    path: 'checkout/success',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
