import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
  
  declare var tinymce: any;
  
  @Component({
    selector: 'tinymce',
    template: `<textarea rows="20" id="{{elementId}}">{{data}}</textarea>`
  })
  export class TinymceComponent implements AfterViewInit, OnDestroy {
    @Input() elementId: string;
    @Input() data: any;
    @Output() onEditorKeyup = new EventEmitter<any>();
  
    editor;
  
    ngAfterViewInit() {
      tinymce.init({
        selector: '#' + this.elementId,
        plugins: ['link', 'paste', 'table', 'code'],
        setup: editor => {
          this.editor = editor;
          editor.on('keyup', () => {
            const content = editor.getContent();
            this.onEditorKeyup.emit(content);
          });
        },
      });
    }
  
    ngOnDestroy() {
      tinymce.remove(this.editor);
    }
  }
  