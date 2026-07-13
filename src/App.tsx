import { Toaster } from 'sonner';

import { QueryProvider } from '@/app/providers/query-provider';
import { AppRouter } from '@/app/router';

export function App() {
  return (
    <QueryProvider>
      <AppRouter />
      <Toaster position="top-right" richColors closeButton />
    </QueryProvider>
  );
}
