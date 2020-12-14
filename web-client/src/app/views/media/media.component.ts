import { Component, ElementRef, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { env } from 'process';
import { Environment } from 'src/app/model/environment.model';
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
  // Optional input paramater
  @Input('environment') environment?: Environment;

  public images: Image[];
  public ready: boolean;

  @ViewChild('LightGallery', { static: false }) lgContainer: ElementRef;

  constructor(private api: BMSService, private auth: AuthService) { }

  ngOnInit(): void {
    this.ready=false;

    if (this.environment != null) {
      console.log("Using environment specific config")
      this.api.getImages(this.environment.id)
      .subscribe((data) => {
        // TODO: merge this map into an image helper
        this.images = data;
  
        this.initLightGallery();
      });
    } else {
      this.api.getAllImages()
      .subscribe((data) => {
        // TODO: merge this map into an image helper
        this.images = data;
  
        this.initLightGallery();
      });
    }
    
    
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

  public getThumbnailUrl(image, size): string {
    let link = new URL(image.link.toString(), location.toString());
    link.searchParams.append('size', size.toString());
    return link.toString()
  }

  public generateCaption(image: Image) {
    if (this.environment != null) {
      return `<h4>Environment ID: ${image.environment.toString()}</h4><p>${image.uploaded_on.toString()}`
    } else {
      return `<h4>Environment ID: ${image.environment.toString()}</h4><p>${image.uploaded_on.toString()}`
    }

  }

  
}
