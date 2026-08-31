import React, { useState } from 'react';
import { apiLogin, apiRegister, AuthResult } from '../services/api';

interface Props {
  onAuthed: (email: string, role: string) => void;
}

export default function LoginScreen({ onAuthed }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    let r: AuthResult;
    if (mode === 'login') r = await apiLogin(email, password);
    else r = await apiRegister(email, password);
    setBusy(false);
    if (r.ok && r.email) { onAuthed(r.email, r.role || 'user'); return; }
    setError(msgs[r.error || 'fallo'] || 'Error de autenticación');
  };

  const msgs: Record<string, string> = {
    credenciales_invalidas: 'Email o contraseña incorrectos',
    email_ya_registrado: 'Ese email ya está registrado',
    password_min_8: 'La contraseña debe tener al menos 8 caracteres',
    email_invalido: 'Email no válido',
    email_y_password_requeridos: 'Introduce email y contraseña',
    fallo: 'Fallo en la autenticación',
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0A0C10] text-[#E2E8F0] font-sans">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-indigo-500/30 bg-[#11141B] p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-indigo-300">AegisNet</h1>
          <p className="mt-1 text-sm text-slate-400">Acceso con registro</p>
        </div>

        <div className="mb-4 flex overflow-hidden rounded-lg border border-slate-700 text-sm">
          <button type="button" onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 ${mode === 'login' ? 'bg-indigo-600 text-white' : 'bg-transparent text-slate-400'}`}>Iniciar sesión</button>
          <button type="button" onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 ${mode === 'register' ? 'bg-indigo-600 text-white' : 'bg-transparent text-slate-400'}`}>Crear cuenta</button>
        </div>

        <label className="mb-1 block text-xs text-slate-400">Email</label>
        <input
          value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
          className="mb-3 w-full rounded-lg border border-slate-700 bg-[#0A0C10] px-3 py-2 text-sm outline-none focus:border-indigo-500"
          placeholder="tu@email.com"
        />
        <label className="mb-1 block text-xs text-slate-400">Contraseña</label>
        <input
          value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8}
          className="mb-4 w-full rounded-lg border border-slate-700 bg-[#0A0C10] px-3 py-2 text-sm outline-none focus:border-indigo-500"
          placeholder="••••••••"
        />

        {error && <p className="mb-3 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}

        <button type="submit" disabled={busy}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
          {busy ? '...' : mode === 'login' ? 'Entrar' : 'Registrarse'}
        </button>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          El registro es abierto, pero los datos de investigación quedan
          restringidos al propietario autenticado.
        </p>
      </form>
    </div>
  );
}
