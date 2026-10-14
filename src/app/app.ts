import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthShell } from './Auth/Shell/auth-shell';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('gerador-certificados');
}
