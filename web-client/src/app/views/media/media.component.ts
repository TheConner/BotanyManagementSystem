import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Image } from 'src/app/model/Image.model';
import { AuthService } from 'src/app/service/auth.service';
import { BMSService } from 'src/app/service/bms.service';

declare const lightGallery: any;

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {
  public images: Image[];
  public ready: boolean;

  @ViewChild('LightGallery', { static: false }) lgContainer: ElementRef;

  constructor(private api: BMSService, private auth: AuthService) { }

  ngOnInit(): void {
    this.ready=false;
    this.api.getAllImages()
    .subscribe((data) => {
      // TODO: merge this map into an image helper
      this.images = data;

      this.initLightGallery();
    });
  }

  initLightGallery() {
    setTimeout(() => {
      this.ready=true;
      console.log('--- After Init ---');
      console.log(document.getElementById("GalleryContainer"));
      lightGallery(document.getElementById("GalleryContainer"),{
        thumbnail:true,
        animateThumb: false,
        showThumbByDefault: false
      });
    },2000)
  }

  
}
