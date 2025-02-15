### Installation

Install via Package managers such as [npm][npm] or [yarn][yarn]

```bash
npm install ngx-editor --save
# or
yarn add ngx-editor
```

### Usage

Import `ngx-editor` module

```ts
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [NgxEditorModule],
})
export class AppModule {}
```

Then in HTML

```html
<ngx-editor [ngModel]="jsonDoc"></ngx-editor>
```

For `ngModel` to work, You must import `FormsModule` from `@angular/forms`

[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/lang/en/
