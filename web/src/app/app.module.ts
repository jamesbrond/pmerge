import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { CtrlClickDirective } from './directives';
import { KeysPipe } from './pipes';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { FolderComponent, PreviewComponent, DuplicateModalComponent } from './components';

@NgModule({
  declarations: [
    AppComponent,
    KeysPipe,
    CtrlClickDirective,
    FolderComponent,
    PreviewComponent,
    DuplicateModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FontAwesomeModule
  ],
  providers: [
    NgbActiveModal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
