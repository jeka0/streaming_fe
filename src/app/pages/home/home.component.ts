import { Component } from '@angular/core';
import { StreamService } from 'src/app/shared/services/stream.service'; 
import { IStream } from 'src/app/shared/interfaces/stream.interface';
import { mergeMap, map, mergeAll, toArray, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  streams: IStream[] = [];

  constructor(private streamService: StreamService){}

  ngOnInit(){
    this.streamService.getLiveStreams()
    .subscribe({
      next:(streams)=>{this.streams = streams},
      error:(err)=>console.log(err)
    })
  }
}
