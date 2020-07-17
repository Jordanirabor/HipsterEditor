import { AuthService } from './../../services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';
import * as MediumEditor from 'medium-editor';
import * as math from 'mathjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  items: any;
  editor: MediumEditor.MediumEditor;
  existingText: string;
  latexRegex = new RegExp(/(\$(.*?)\$)/);
  constructor(private db: AngularFireDatabase, private authService: AuthService) {
    this.items = db.list('posts').valueChanges();
  }

  ngOnInit(): void {
    this.initializeEditor();
  }

  initializeEditor(): void {
    const editor = new MediumEditor('.editable');

    this.db.database.ref(`posts/${this.authService?.user?.uid}`)
      .once('value')
      .then(value => {
        const existingText = value.child('text').val();

        if (existingText) {
          editor.setContent(existingText);
        }

        editor.subscribe('editableInput', () => {
          const text = editor.getContent();
          console.log(text.match(this.latexRegex));
          text.match(this.latexRegex).forEach(res => {
            console.log(res);
            // console.log(math.evaluate(res));
          });
          console.log();
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
