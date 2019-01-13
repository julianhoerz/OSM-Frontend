import { Component, Input, OnChanges } from '@angular/core';
import Map from 'ol/Map';
import * as ol from 'ol';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Overlay ,CdkOverlayOrigin, OverlayConfig} from '@angular/cdk/overlay';
import {TemplatePortalDirective, ComponentPortal} from '@angular/cdk/portal';
import { SettingsComponent } from './settings/settings.component';
import {toLonLat} from 'ol/proj.js';
import {ApiService} from './_services/api.service';
import {Table} from './_models/table';



@Component({
        selector: 'controller',
        templateUrl: './controller.component.html'
    })
    export class Controller {

    startCoords: String = null;
    endCoords: String = null;
    selector: number = 0;
    @Input() currentPosition: ol.Coordinates;
    @Input() map: Map;
    @Input() vectorLayer: VectorLayer;

    constructor(private ApiService: ApiService){}

    ngOnChanges(){
        if(this.currentPosition){
            if(this.selector == 1){
                console.log("Set Start Position");
                this.startCoords = toLonLat(this.currentPosition);
                console.log(this.startCoords);
            }
            if(this.selector == 2){
                console.log("Set End Position");
                this.endCoords = toLonLat(this.currentPosition);
                console.log(this.endCoords);
            }
            if(this.startCoords && this.endCoords){
                console.log("Enable Button");
            }
        }
    }


    setStart(){
        if(this.selector == 1){
            this.selector = 0;
        }
        else{
            this.selector = 1;
        }
    }

    setEnd(){
        if(this.selector == 2){
            this.selector = 0;
        }
        else{
            this.selector = 2;
        }
    }

    startDijkstra(){
        if(this.startCoords && this.endCoords){
            console.log("Start with dijkstra.");
            this.ApiService.getRoute(this.startCoords +","+ this.endCoords)
                .then(response => {
                    console.log(response);
                    this.drawRoute(response);
                    return;
                });
        }
    }

    drawRoute(geojsonObject: string){

        var format = new GeoJSON({
            featureProjection: 'EPSG:3857'
        });

        var vectorSource = new VectorSource({
            features: format.readFeatures(geojsonObject)
        });


        this.vectorLayer.setSource(vectorSource);


    }

}