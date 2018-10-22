import { Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Overlay ,CdkOverlayOrigin, OverlayConfig} from '@angular/cdk/overlay';
import {TemplatePortalDirective, ComponentPortal} from '@angular/cdk/portal';
import { SettingsComponent } from './settings/settings.component';



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

    @ViewChild('myOrigin') myOrigin: CdkOverlayOrigin;
    @ViewChild('settings') settings: CdkOverlayOrigin;
    // @ViewChild('myOverlay') myOverlay: TemplatePortalDirective;
    @ViewChild(CdkOverlayOrigin) _overlayOrigin: CdkOverlayOrigin;
    @ViewChild('tortelliniTemplate') tortelliniTemplate: TemplatePortalDirective;

    ngOnInit():void{

        this.openSpaghettiPanel();
        //this.openSettingsPanel();


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
        // let strategy = this.overlay.position()
        // .connectedTo(
        //     this.myOrigin.elementRef,
        //     {originX: 'start', originY: 'bottom'},
        //     {overlayX: 'start', overlayY: 'top'} );
        let strategy = this.overlay.position().global().bottom('auto');
        let config = new OverlayConfig({positionStrategy: strategy});
        let overlayRef = this.overlay.create(config);


        // overlayRef.attach(new ComponentPortal(SpagettiPanel, this.viewContainerRef));
        overlayRef.attach(this.tortelliniTemplate);

    }




}


@Component({
    selector: 'spagetti-panel',
    templateUrl: './spagetti.component.html'
  })
  export class SpagettiPanel {
    value: string = 'Omega';
  }