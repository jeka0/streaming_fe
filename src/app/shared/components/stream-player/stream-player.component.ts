import { Component, ElementRef, ViewChild } from '@angular/core';
import flvjs from 'flv.js';

@Component({
  selector: 'app-stream-player',
  templateUrl: './stream-player.component.html',
  styleUrls: ['./stream-player.component.css']
})
export class StreamPlayerComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  flvPlayer?:flvjs.Player;

  streamKey: string = '0h5143oc1';

  ngAfterViewInit() {
    this.playFLV();
  }

  ngOnDestroy(){
    if(this.flvPlayer){
      this.flvPlayer.pause();
      this.flvPlayer.unload();
      this.flvPlayer.detachMediaElement();
      this.flvPlayer.destroy();
    }
  }

  playFLV(){
    const video = this.videoPlayer.nativeElement;
    if (flvjs.isSupported()) {
      this.flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: `http://localhost:8888/live/0h5143oc1.flv`,
      });
      this.flvPlayer.attachMediaElement(video);
      this.flvPlayer.load();
      this.flvPlayer.play();

    }
  }
}
