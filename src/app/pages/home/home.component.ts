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
  streams: (IStream | undefined)[] = [];

  constructor(private streamService: StreamService){}

  ngOnInit(){
    this.streamService.getLiveStreams()
    .pipe(
      map((streams)=>{
        let keys: String[] = [];
        for(let key in streams['live']){
          keys.push(key);
        }
        return keys;
    }),
      mergeAll(),
        mergeMap((streamKey) => {
          if (streamKey) {
            return this.streamService.getLiveStream(streamKey);
          }
          return of(undefined);
        }),
        toArray(),
    )
    .subscribe({
      next:(streams)=>{console.log(streams);this.streams = streams},
      error:(err)=>console.log(err)
    })
  }
}
