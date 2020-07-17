import { TweenMax } from 'gsap';
import * as math from 'mathjs';
import * as MediumEditor from 'medium-editor';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  items: any;
  existingText: string;
  editor: MediumEditor.MediumEditor;
  latexRegex = new RegExp(/\$((\d+[+\-*\/^%])*(\d+))\$/);

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {
    this.items = db.list('posts').valueChanges();
  }

  ngOnInit(): void {
    this.startAnimation();
    this.initializeEditor();
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
        y: -500,
        opacity: 0,
        duration: 1.2,
      });
    }
  }

  initializeEditor(): void {
    const editor = new MediumEditor('.editable', { placeholder: false });

    this.db.database
      .ref(`posts/${this.authService?.user?.uid}`)
      .once('value')
      .then((value) => {
        const existingText = value.child('text').val();

        if (existingText) {
          editor.setContent(existingText);
        }

        //LaTex equation
        editor.subscribe('editableInput', () => {
          const text = editor.getContent();

          if (text.match(this.latexRegex)) {
            editor.setContent('');
            editor.pasteHTML(
              text.replace(
                text.match(this.latexRegex)[0],
                math.evaluate(text.match(this.latexRegex)[1])
              )
            );
          }
          this.save(editor.getContent());
        });
      });
  }

  private save(text: string): void {
    this.db.list('posts').set(this.authService.user.uid, { text });
  }

  logout(): void {
    this.authService.logout();
  }
}
