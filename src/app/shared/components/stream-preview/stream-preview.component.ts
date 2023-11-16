import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IStream } from '../../interfaces/stream.interface';

@Component({
  selector: 'app-stream-preview',
  templateUrl: './stream-preview.component.html',
  styleUrls: ['./stream-preview.component.css']
})
export class StreamPreviewComponent {
  @Input() stream!: IStream;
  streamUrl: String = "";
  avatar: String = 'assets/Img/avatar.jpg';
  url: String = `${environment.apiURL}/image/`;

  ngOnInit(){
    this.streamUrl = `${environment.apiURL}/thumbnail/${this.stream.user.streamKey}.png`;
    if(this.stream.user.image) this.avatar = this.url + this.stream.user.image;
  }
}
