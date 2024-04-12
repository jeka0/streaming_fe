import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { Subject } from 'rxjs';
import flvjs from 'flv.js';

@Component({
  selector: 'app-stream-player',
  templateUrl: './stream-player.component.html',
  styleUrls: ['./stream-player.component.css']
})
export class StreamPlayerComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @Input() name!: Subject<string>;
  @Input() video?: string;
  url?: string;
  flvPlayer?: flvjs.Player;
  baseUrl: string = "http://localhost:8888/live/";

  ngAfterViewInit() {
    this.name.subscribe({
      next:(name)=>{
        if(!this.video)this.playFLV(name)
        else{
          this.url = `${this.baseUrl}${name}/${this.video}`;
        }
      },
      error:(err)=>console.log(err)
    })
  }

  ngOnDestroy(){
    if(this.flvPlayer){
      this.flvPlayer.pause();
      this.flvPlayer.unload();
      this.flvPlayer.detachMediaElement();
      this.flvPlayer.destroy();
    }
  }

  playFLV(name: string){
    const video = this.videoPlayer.nativeElement;
    if (flvjs.isSupported()) {
      this.flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: `${this.baseUrl}${name}.flv`,
      });
      this.flvPlayer.attachMediaElement(video);
      this.flvPlayer.load();
      this.flvPlayer.play();

    }
  }
}
