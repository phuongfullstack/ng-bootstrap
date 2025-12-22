import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreToastrComponent } from '@shared/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreToastrComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ng-boostrap');
}
