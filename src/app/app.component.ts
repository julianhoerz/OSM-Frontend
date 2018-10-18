import { Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Overlay ,CdkOverlayOrigin, OverlayConfig} from '@angular/cdk/overlay';
import {TemplatePortalDirective, ComponentPortal} from '@angular/cdk/portal';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class AppComponent {
    title = 'my-app';
    map: Map;


    constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef){}

    // @ViewChild('myOrigin') myOrigin: CdkOverlayOrigin;
    // @ViewChild('myOverlay') myOverlay: TemplatePortalDirective;
    @ViewChild(CdkOverlayOrigin) _overlayOrigin: CdkOverlayOrigin;


    ngOnInit():void{

        this.openSpaghettiPanel();


        new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
              center: [0, 0],
              zoom: 2
            })
          });
    }



    openSpaghettiPanel(){
        let strategy = this.overlay.position()
        .connectedTo(
            this._overlayOrigin.elementRef,
            {originX: 'start', originY: 'bottom'},
            {overlayX: 'start', overlayY: 'top'} );

        let config = new OverlayConfig({positionStrategy: strategy});
        let overlayRef = this.overlay.create(config);


        overlayRef.attach(new ComponentPortal(SpagettiPanel, this.viewContainerRef));

    }

}


@Component({
    selector: 'spagetti-panel',
    templateUrl: './spagetti.component.html'
  })
  export class SpagettiPanel {
    value: string = 'Omega';
  }