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
  @Input() streamKey!: Subject<string>;
  flvPlayer?: flvjs.Player;

  ngAfterViewInit() {
    this.streamKey.subscribe({
      next:(streamKey)=>this.playFLV(streamKey),
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

  playFLV(streamKey: string){
    const video = this.videoPlayer.nativeElement;
    if (flvjs.isSupported()) {
      this.flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: `http://localhost:8888/live/${streamKey}.flv`,
      });
      this.flvPlayer.attachMediaElement(video);
      this.flvPlayer.load();
      this.flvPlayer.play();

    }
  }
}
