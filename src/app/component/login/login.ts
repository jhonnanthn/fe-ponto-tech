import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

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
              localStorage.setItem('auth.token', res.token);
              if (res['user']) {
                localStorage.setItem('auth.user', JSON.stringify(res['user']));
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
