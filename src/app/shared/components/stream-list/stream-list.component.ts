import { Component, Input } from '@angular/core';
import { StreamService } from 'src/app/shared/services/stream.service'; 
import { IStream } from 'src/app/shared/interfaces/stream.interface';
import { IPagination } from 'src/app/shared/interfaces/pagination.interface';

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.css']
})
export class StreamListComponent {
  @Input() live: boolean = false;
  title!: string;
  emptyMessage!: string;
  streams: IStream[] = [];
  length!: number;
  pages: number[] = [3, 6, 9, 12];

  constructor(private streamService: StreamService){}

  ngOnInit(){
    this.title = this.live? "Трансляции в прямом эфире" :"Записи трансляций:";
    this.emptyMessage = this.live? "На данный момент трансляции отсутствуют!":"На данный момент записи трансляций отсутствуют!"
    this.getStreams({page: 1, limit: this.pages[0]});
  }

  getStreams({page, limit, order, category}:IPagination){
    const obs = this.live? this.streamService.getLiveStreamsRange(page, limit, order, category)
    : this.streamService.getStreamsRange(page, limit, order, category);
    obs.subscribe({
      next:(result)=>{
        this.length = result.total;
        this.streams = result.data;
      },
      error:err=> console.log(err)
    })
}
}
