import { Component, OnInit } from '@angular/core';
import { GALLERY_IMAGE, GALLERY_CONF } from 'ngx-image-gallery';
import { Image } from 'src/app/model/Image.model';
import { BMSService } from 'src/app/service/bms.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {
  //public images: Image[];
  images: GALLERY_IMAGE[]=[];
  // gallery configuration
  conf: GALLERY_CONF = {
    imageOffset: '0px',
    showDeleteControl: false,
    showImageTitle: false,
  };
  constructor(private api: BMSService) { }

  ngOnInit(): void {
    this.api.getAllImages()
    .subscribe((images) => {
      let tmp = []
      images.forEach(i => {
        tmp.push({
          altText: 'woman-in-black-blazer-holding-blue-cup', 
          title: 'woman-in-black-blazer-holding-blue-cup',
          url: "/api/Image/" + i.id,
          thumbnailUrl: "/api/Image/" + i.id + "?size=256"
        });
      });
      this.images=this.images.concat(tmp);
        console.log(this.images);
    })
  }
}
