import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RegistrationComponent } from './pages/registration/registration.component';
import { WrapperComponent } from './pages/wrapper/wrapper.component';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { StreamPlayerComponent } from './shared/components/stream-player/stream-player.component';
import { HomeComponent } from './pages/home/home.component';
import { StreamComponent } from './pages/stream/stream.component';
import { ChatComponent } from './shared/components/chat/chat.component';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from './shared/components/message/message.component';
import { StreamPreviewComponent } from './shared/components/stream-preview/stream-preview.component';
import { UserPreviewComponent } from './shared/components/user-preview/user-preview.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { ImageTemplateComponent } from './shared/components/image-template/image-template.component';
import { UserComponent } from './pages/user/user.component';
import { Page404Component } from './pages/page404/page404.component';
import { SearchInputComponent } from './shared/components/search-input/search-input.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    WrapperComponent,
    StreamPlayerComponent,
    HomeComponent,
    StreamComponent,
    ChatComponent,
    MessageComponent,
    StreamPreviewComponent,
    UserPreviewComponent,
    UserSettingsComponent,
    ImageTemplateComponent,
    UserComponent,
    Page404Component,
    SearchInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatMenuModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: AuthInterceptor,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
