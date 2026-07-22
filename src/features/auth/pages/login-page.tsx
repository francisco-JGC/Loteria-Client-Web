import { type FormEvent, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useLogin } from '@/features/auth/hooks/use-login';
import { APP_ROUTES } from '@/shared/constants/routes';

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from?.pathname
    ?? APP_ROUTES.home;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    login.mutate(
      { username, password },
      {
        onError: (apiError) => setError(apiError.message),
        onSuccess: () => navigate(from, { replace: true }),
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
      >
        <div className="flex flex-col items-center space-y-2">
          <img
            src="/logo.png"
            alt="LM NICA"
            className="size-24 object-contain"
          />
          <h1 className="text-2xl font-black tracking-tight">
            LM NICA <span className="text-primary">Admin</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresa con tus credenciales de administrador
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Usuario</label>
          <input
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contraseña</label>
          <input
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 text-destructive text-sm px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="inline-flex w-full h-10 items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition"
        >
          {login.isPending && <Loader2 className="size-4 animate-spin" />}
          {login.isPending ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
