import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import flvjs from 'flv.js';

@Component({
  selector: 'app-stream-player',
  templateUrl: './stream-player.component.html',
  styleUrls: ['./stream-player.component.css']
})
export class StreamPlayerComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @Input() streamKey: string = '';
  flvPlayer?: flvjs.Player;

  /*ngAfterViewInit() {
    console.log(this.streamKey)
    this.playFLV();
  }*/

  ngOnChanges(){
    if(this.streamKey) {
      this.playFLV();
    }
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
        url: `http://localhost:8888/live/${this.streamKey}.flv`,
      });
      this.flvPlayer.attachMediaElement(video);
      this.flvPlayer.load();
      this.flvPlayer.play();

    }
  }
}
