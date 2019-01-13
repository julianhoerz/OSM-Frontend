import { Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import * as ol from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Overlay ,CdkOverlayOrigin, OverlayConfig} from '@angular/cdk/overlay';
import {TemplatePortalDirective, ComponentPortal} from '@angular/cdk/portal';
import { SettingsComponent } from './settings/settings.component';
import {fromLonLat} from 'ol/proj.js';
import {ApiService} from './_services/api.service';
import {Table} from './_models/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class AppComponent {
    title = 'my-app';
    map: Map;
    myHTML = "Hallo Welt....";
    currentSelection: Coordinates = null;
    vectorLayer: VectorLayer;


    constructor(
        private overlay: Overlay, 
        private viewContainerRef: ViewContainerRef,
        private ApiService: ApiService){}

    // @ViewChild('myOrigin') myOrigin: CdkOverlayOrigin;
    // @ViewChild('settings') settings: CdkOverlayOrigin;
    // // @ViewChild('myOverlay') myOverlay: TemplatePortalDirective;
    // @ViewChild(CdkOverlayOrigin) _overlayOrigin: CdkOverlayOrigin;
    @ViewChild('controllOverlay') controllOverlay: TemplatePortalDirective;

    ngOnInit():void{

        this.openControllOverlay();

        var source = new VectorSource();

        var styles = {

            'LineString': new Style({
              stroke: new Stroke({
                color: 'green',
                width: 4
              })
            })

          };

        var styleFunction = function(feature) {
            return styles[feature.getGeometry().getType()];
          };

        this.vectorLayer = new VectorLayer({
            source: source,
            updateWhileAnimating: true,
            updateWhileInteracting: true,
            style: styleFunction
        });
          

        this.map = new Map({
            loadTilesWhileAnimating: true,
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                this.vectorLayer
            ],
            view: new View({
                center: fromLonLat([9.201047,48.658488]),
                zoom: 10
            })
        });

        this.initPopup();
        





        this.ApiService.getTable().then(result => {console.log("" + result.Name)});

    }



    openControllOverlay(){

        let strategy = this.overlay.position().global().bottom('auto');
        let config = new OverlayConfig({positionStrategy: strategy});
        let overlayRef = this.overlay.create(config);
        overlayRef.attach(this.controllOverlay);

    }

    // initPopup(element: any, callback: any){
    initPopup(){
        this.map.on('click',evt =>{
            var feature = evt.map.getCoordinateFromPixel(evt.pixel);
            this.currentSelection = feature;
        });
    }




}


