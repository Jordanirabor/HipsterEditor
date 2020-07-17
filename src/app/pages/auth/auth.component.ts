import { TweenMax } from 'gsap';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.startAnimation();
  }
  startAnimation(): void {
    if (
      document.readyState === 'interactive' ||
      document.readyState === 'complete'
    ) {
      resolve();
    } else {
      window.addEventListener('DOMContentLoaded', resolve);
    }

    function resolve() {
      document.body.removeAttribute('unresolved');

      TweenMax.from('.container', {
        y: 500,
        opacity: 0,
        duration: 1.2,
      });
    }
  }

  login(): void {
    this.authService
      .login()
      .then(() => {
        this.router.navigate(['editor']);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
