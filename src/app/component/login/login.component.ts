import { Component, ElementRef, OnInit } from '@angular/core';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  constructor(private _elementRef: ElementRef, private loginService: LoginService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
  }

  protected getLoginStatus(): boolean {
    return this.loginService.getAuthStatus();
  }
}
