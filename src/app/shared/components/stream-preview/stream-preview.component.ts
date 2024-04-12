import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IStream } from '../../interfaces/stream.interface';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-stream-preview',
  templateUrl: './stream-preview.component.html',
  styleUrls: ['./stream-preview.component.css']
})
export class StreamPreviewComponent {
  @Input() stream!: IStream;
  @Input() live!: Boolean;
  streamUrl: String = "";
  errUrl: String = 'assets/Img/stream_image.jpg';
  image: BehaviorSubject<string | undefined>;
  routerLink: string='';

  constructor(){
    this.image = new BehaviorSubject<string | undefined>(undefined);
  }

  error(){
    this.streamUrl = this.errUrl;
  }

  ngOnInit(){
    this.image.next(this.stream.user.image)
    if(this.live) {
      this.streamUrl = `${environment.apiURL}/thumbnail/${this.stream.user.login}.png`;
      this.routerLink = this.stream.user.login + '/live';
    } 
    else {
      const name = this.stream.recording_file.split('.')[0];
      this.streamUrl = `${environment.apiURL}/thumbnail/${name}.png`
      this.routerLink = name;
    }
  }
}
