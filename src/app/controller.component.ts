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
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';



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
    @Input() vectorLayer1: VectorLayer;
    allmarkers: Feature[] = [];
    startmarker: Feature = null;
    endmarker: Feature = null;

    constructor(private ApiService: ApiService){}

    ngOnChanges(){
        if(this.currentPosition){
            if(this.selector == 1){
                console.log("Set Start Position");
                this.startCoords = toLonLat(this.currentPosition);
                console.log(this.startCoords);


                if(this.startmarker){
                    this.allmarkers.splice(this.allmarkers.indexOf(this.startmarker),1);
                }
                var point = new Point(this.currentPosition);
                this.startmarker = new Feature(point);

                this.allmarkers.push(this.startmarker);

                var vectorSource = new VectorSource({
                    features: this.allmarkers
                });
    
                this.vectorLayer1.setSource(vectorSource);

                this.selector = 0;
            }
            if(this.selector == 2){
                console.log("Set End Position");
                this.endCoords = toLonLat(this.currentPosition);
                console.log(this.endCoords);


                if(this.endmarker){
                    this.allmarkers.splice(this.allmarkers.indexOf(this.endmarker),1);
                }
                var point = new Point(this.currentPosition);
                this.endmarker = new Feature(point);

                this.allmarkers.push(this.endmarker);

                var vectorSource = new VectorSource({
                    features: this.allmarkers
                });
    
                this.vectorLayer1.setSource(vectorSource);


                this.selector = 0;
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


    buildTable(){

        this.ApiService.getTable()
            .then(result => {
                console.log(result);

            });
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