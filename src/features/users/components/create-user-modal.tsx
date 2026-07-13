import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, Save } from 'lucide-react';

import { useCreateUser } from '@/features/users/hooks/use-users';
import { cn } from '@/shared/lib/cn';
import { Modal } from '@/shared/ui/modal';

import type { UserRole } from '@/features/users/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  username: string;
  password: string;
  role: UserRole;
}

const EMPTY: FormState = {
  name: '',
  username: '',
  password: '',
  role: 'seller',
};

export function CreateUserModal({ open, onClose }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync, isPending, error, reset } = useCreateUser();

  // Reset the form + errors every time the modal opens.
  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setShowPassword(false);
      reset();
    }
  }, [open, reset]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const trimmed = {
    name: form.name.trim(),
    username: form.username.trim(),
  };
  const isValid =
    trimmed.name.length > 0 &&
    trimmed.username.length >= 3 &&
    form.password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isPending) return;
    await mutateAsync({
      name: trimmed.name,
      username: trimmed.username,
      password: form.password,
      role: form.role,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo usuario"
      description="Los usuarios con rol vendedor podrán iniciar sesión en la app móvil."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="create-user-form"
            disabled={!isValid || isPending}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition',
              !isValid || isPending
                ? 'cursor-not-allowed opacity-60'
                : 'hover:bg-primary/90',
            )}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" strokeWidth={2.4} />
            )}
            Guardar
          </button>
        </>
      }
    >
      <form
        id="create-user-form"
        onSubmit={handleSubmit}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="Nombre completo" required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Escriba el nombre completo"
            maxLength={120}
            autoFocus
            className={inputClass}
          />
        </Field>

        <Field
          label="Nombre de usuario"
          hint="Sin espacios, mínimo 3 caracteres"
          required
        >
          <input
            type="text"
            value={form.username}
            onChange={(e) =>
              set('username', e.target.value.replace(/\s+/g, ''))
            }
            placeholder="ej. juanperez"
            maxLength={60}
            className={inputClass}
          />
        </Field>

        <Field
          label="Contraseña"
          hint="Mínimo 6 caracteres"
          required
        >
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="••••••••"
              maxLength={72}
              className={cn(inputClass, 'pr-10')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
              className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </Field>

        <Field label="Rol" required>
          <div className="grid grid-cols-2 gap-2">
            <RoleOption
              active={form.role === 'seller'}
              onClick={() => set('role', 'seller')}
              title="Vendedor"
              subtitle="Vende desde la app móvil"
            />
            <RoleOption
              active={form.role === 'admin'}
              onClick={() => set('role', 'admin')}
              title="Administrador"
              subtitle="Accede al panel web"
            />
          </div>
        </Field>

        {error && (
          <div className="col-span-full rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error.message}
          </div>
        )}
      </form>
    </Modal>
  );
}

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
        {label}
        {required && <span className="text-destructive">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function RoleOption({
  active,
  onClick,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-start rounded-lg border px-3 py-2.5 text-left transition',
        active
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-border bg-card hover:bg-secondary/60',
      )}
    >
      <span className="text-sm font-bold text-foreground">{title}</span>
      <span className="text-xs text-muted-foreground">{subtitle}</span>
    </button>
  );
}
