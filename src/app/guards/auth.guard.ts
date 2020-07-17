import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(private fireAuth: AngularFireAuth, private router: Router) {

  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.fireAuth.user.pipe(
      map((user) => {
        if (user === null) {
          if (state.url !== '/') {
            this.router.navigate(['']);
            return false;
          }
          return true;
        }

        if (state.url === '/') {
          this.router.navigate(['editor']);
          return false;
        }

        return true;
      }));
  }

}
