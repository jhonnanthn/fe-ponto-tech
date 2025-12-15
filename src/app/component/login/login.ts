import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  loading: boolean = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.error = null;
    this.loading = true;

    this.auth.login({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          if (res && res.token) {
            try {
              // store token
              localStorage.setItem('auth.token', res.token);

              // Try to decode JWT payload (base64url) and store as auth.user when server didn't provide user
              const saveDecodedUser = (obj: any) => {
                try {
                  const user: User = {
                    userId: obj.userId || obj.user_id || obj.sub || undefined,
                    email: obj.email || obj.sub || undefined,
                    fullName: obj.fullName || obj.name || obj.full_name || undefined,
                    role: obj.role || obj['roles'] || undefined
                  };
                  localStorage.setItem('auth.user', JSON.stringify(user));
                 } catch (e) { /* ignore */ }
               };

               if (res['user']) {
                saveDecodedUser(res['user']);
               } else {
                try {
                  const token = res.token as string;
                  if (token && token.split('.').length === 3) {
                    const payload = token.split('.')[1];
                    // base64url -> base64
                    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
                    // pad with '='
                    const pad = base64.length % 4;
                    const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
                    // decode
                    const decoded = typeof atob === 'function'
                      ? atob(padded)
                      : Buffer.from(padded, 'base64').toString('binary');
                    // handle percent-encoding to support unicode
                    const jsonPayload = decodeURIComponent(decoded.split('').map(function(c) {
                      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    const parsed = JSON.parse(jsonPayload);
                    if (parsed) saveDecodedUser(parsed);
                   }
                } catch (err) {
                  // failed to decode token, ignore but log
                  console.warn('Não foi possível decodificar o token JWT', err);
                }
              }
            } catch (e) {
              console.error('Não foi possível salvar o token no localStorage', e);
            }

            // feedback simples
            try { window.alert('Login efetuado com sucesso'); } catch {}
            this.router.navigate(['/records']);
          } else {
            this.error = 'Resposta inválida do servidor: token ausente.';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro no login', err);
          this.error = err?.error?.message || err?.message || 'Erro ao autenticar. Verifique suas credenciais.';
          this.loading = false;
          try { window.alert('Usuário ou senha inválida'); } catch {}
        }
      });
  }

  onResetPassword() {
    try {
      console.warn('Funcionalidade de recuperação de senha não implementada.');
    } catch {}
  }
}
