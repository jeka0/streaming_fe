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
  streamUrl: String = "";
  image: BehaviorSubject<string | undefined>;

  constructor(){
    this.image = new BehaviorSubject<string | undefined>(undefined);
  }

  ngOnInit(){
    this.streamUrl = `${environment.apiURL}/thumbnail/${this.stream.user.streamKey}.png`;
    this.image.next(this.stream.user.image)
  }
}
