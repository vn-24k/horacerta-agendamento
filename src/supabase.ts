/**
 * Supabase Client Oficial do Projeto vn-24k
 * Conectado ao banco de dados PostgreSQL na nuvem (us-west-1)
 */

export const SUPABASE_URL = "https://hfgxsloyssxwfulyzftt.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3hzbG95c3N4d2Z1bHl6ZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODQzNzksImV4cCI6MjA5NDI2MDM3OX0.zDw_CGyNPMs4KGEWmDnQMzgh-SccxalFlB2c07CfJv4";

export interface UserSession {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    user_metadata?: Record<string, any>;
  };
}

export const supabaseAuth = {
  // Cadastro de novo profissional
  async signUp(email: string, password: string, name: string) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password,
        data: { name }
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || data.message || "Erro ao criar conta");
    }
    return data;
  },

  // Login com e-mail e senha
  async signIn(email: string, password: string): Promise<UserSession> {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error_description || data.msg || data.message || "E-mail ou senha incorretos");
    }

    const session: UserSession = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user
    };

    localStorage.setItem("horacerta_session", JSON.stringify(session));
    return session;
  },

  // Logout
  async signOut() {
    const session = supabaseAuth.getSession();
    if (session?.access_token) {
      try {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
          method: "POST",
          headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${session.access_token}`
          }
        });
      } catch (e) {
        console.error("Erro ao deslogar na API:", e);
      }
    }
    localStorage.removeItem("horacerta_session");
  },

  // Recupera sessão local
  getSession(): UserSession | null {
    try {
      const saved = localStorage.getItem("horacerta_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
};

// Funções para persistência de agendamentos no banco
export const supabaseDb = {
  // Salva agendamento
  async createAppointment(appointment: any) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/appointments`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify(appointment)
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Aviso ao salvar no banco Supabase:", e);
    }
    return null;
  },

  // Lista agendamentos do banco
  async getAppointments() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/appointments?order=created_at.desc`, {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }
};
