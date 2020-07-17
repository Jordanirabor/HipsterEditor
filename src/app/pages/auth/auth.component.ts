import { TimelineLite } from 'gsap';
import jQuery from 'jquery'
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

  ngOnInit(): void {}

  startAnimation(): void {
    // set some global properties
    TweenLite.set('.wrap', { perspective: 1000 });
    TweenLite.set('.inner', { transformStyle: 'preserve-3d' });
    TweenLite.set('.back', { rotationX: -90 });
    TweenLite.set(['.back', '.front'], {
      backfaceVisibility: 'hidden',
      transformOrigin: '50% 0',
    });


    jQuery(($: any) => {

    // loop through each element
    $('.wrapper').each(function (i, el) {
      // set some individual properties
      //TweenMax.set($(el).find('.back'), {backgroundColor:'#' + Math.floor(Math.random() * 16777215).toString(16)});

      // create a timeline for this element in paused state
      var tl = new TimelineMax({ paused: true });

      // create your tween of the timeline in a variable
      var t = tl
        .set(el, { willChange: 'transform' })
        //.set($(el).find('.wrap'), {zIndex: 2, overwrite:"all"})
        .to(
          $(el).find('.inner'),
          0.53,
          {
            y: '-40px',
            rotationX: 90,
            z: 0.01,
            zIndex: 2,
            overwrite: 'all',
            ease: Back.easeOut,
          },
          0
        );

      // store the tween timeline in the javascript DOM node
      el.animation = t;

      //create the event handler
      $(el)
        .on('mouseenter', function () {
          this.animation.play();
        })
        .on('mouseleave', function () {
          this.animation.reverse();
        });
    });
  


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
