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
import { TestBed } from '@angular/core/testing';
import {fromLonLat} from 'ol/proj.js';



@Component({
        selector: 'controller',
        templateUrl: './controller.component.html'
    })
    export class Controller {

    fileToUpload: File = null;
    filecontent: String = "";
    startCoords: String = null;
    endCoords: String = null;
    selector: number = 0;
    @Input() currentPosition: ol.Coordinates;
    @Input() map: Map;
    @Input() vectorLayer: VectorLayer;
    @Input() vectorLayer1: VectorLayer;
    @Input() mapMatchingLayer: VectorLayer;
    allmarkers: Feature[] = [];
    startmarker: Feature = null;
    endmarker: Feature = null;
    mapmatchingmarker: Feature[] = [];

    sigma_standard: string = '5';
    sigma_value: string = '';

    beta_standard: string = '5';
    beta_value: string = '';

    kNN_standard: string = '10';
    kNN_value: string = '';

    startactive: string = '';
    endactive: string = '';
    addactive: string = '';

    disableMatch: boolean = true;
    disableDelete: boolean = true;
    disableFindRoute: boolean = true;

    constructor(private ApiService: ApiService){}

    buildPoint(lat,lng){
        console.log("Lat: " + lat);
        console.log("Lng: " + lng);
        var point = new Point(fromLonLat([lng,lat]));
        console.log(point);
        //this.einfachertest();
        this.setMapmatchingPoint(new Point(fromLonLat([lng,lat])));
    }



    handleFileInput(file){

        this.deleteRoute();

        new Promise((resolve, reject) => {
          var fr = new FileReader();  
          fr.onload = () => {
            resolve(fr.result)
          };
          fr.readAsText(file.item(0));
        }).then(thiscontent => {
            var parts = (thiscontent+"").split(";");
            if(parts.length <= 0){
                console.log("Wrong File...");
            }
            else{
                for(var i = 0; i< parts.length; i ++){
                    var point = JSON.parse(parts[i]);
                    this.buildPoint(point.lat,point.lng);
                }
            }
        })
      }

    handleFileeInput(files: FileList) {

        function buildPoint(lat,lng){
            console.log("Lat: " + lat);
            console.log("Lng: " + lng);
            var point = new Point(fromLonLat([lng,lat]));
            console.log(point);
            this.einfachertest();
            //this.setMapmatchingPoint(new Point(fromLonLat([lng,lat])));
        }

        this.fileToUpload = files.item(0);
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
            var thiscontent = fileReader.result + "";
            var parts = thiscontent.split(";");
            if(parts.length <= 0){
                console.log("Wrong File...");
            }
            else{
                for(var i = 0; i< parts.length; i ++){
                    var point = JSON.parse(parts[i]);
                    buildPoint(point.lat,point.lng);
                }
            }
        };
        fileReader.readAsText(this.fileToUpload);
        
    }


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

                this.startactive = "";
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

                this.endactive = "";
                this.selector = 0;
            }
            if(this.selector == 3){
                console.log("Set Map Matching Position");
                console.log(this.currentPosition);
                
                this.setMapmatchingPoint(new Point(this.currentPosition));
            }



            if(this.startCoords && this.endCoords){
                console.log("Enable Button");
                this.disableFindRoute = false;
            }
        }
    }


    setMapmatchingPoint(point: Point){
        var marker = new Feature(point);

        this.mapmatchingmarker.push(marker);

        var vectorSource = new VectorSource({
            features: this.mapmatchingmarker
        });

        this.mapMatchingLayer.setSource(vectorSource);

        if(this.mapmatchingmarker.length >= 1){
            //enable delete
            this.disableDelete = false;
            if(this.mapmatchingmarker.length >= 2){
                //enable matchbutton
                this.disableMatch = false;
                console.log(this.disableMatch);
            }
        }
    }


    deleteRoute(){
        console.log("Delete MapMatching Markers");
        this.mapmatchingmarker = [];
        this.mapMatchingLayer.setSource(new VectorSource());
        this.disableDelete = true;
        this.disableMatch = true;

        this.vectorLayer.setSource(new VectorSource());
        this.selector = 0;
        this.addactive = "";


    }

    startMapMatching(){

        this.selector = 0;
        this.addactive = "";

        var sigma = Number(this.sigma_value);
        var beta = Number(this.beta_value);
        var kNN = Number(this.kNN_value);
        if(isNaN(sigma) || sigma <= 0 || sigma >= 40){
            sigma = Number(this.sigma_standard);
            this.sigma_value = String(sigma);
        }
        if(isNaN(beta) || beta <= 0 || beta >= 40){
            beta = Number(this.beta_standard);
            this.beta_value = String(beta);
        }
        if(isNaN(kNN) || kNN <= 0 || kNN >=30){
            kNN = Number(this.kNN_standard);
            this.kNN_value = String(kNN);
        }
        var params = JSON.parse('{"sigma":"", "beta":"", "kNN":""}');
        params.sigma = sigma;
        params.beta = beta;
        params.kNN = kNN
        
        var coordinates = JSON.parse('{"type":"FeatureCollection","features": [{"type": "Feature","properties": {},"geometry": {"type": "LineString","coordinates": []}}]}');
        coordinates.features[0].properties = params;
        var coordsarray = [];
        this.mapmatchingmarker.reverse;
        this.mapmatchingmarker.forEach(function(element){
            coordsarray.push(toLonLat(element.getGeometry().getCoordinates()))
        });
        this.mapmatchingmarker.reverse;
        coordinates.features[0].geometry.coordinates = coordsarray;
        console.log(coordinates);

        this.ApiService.postMapMatching(coordinates).then(response => {
            console.log(response);
            this.drawRoute(response);
            return;
        });
    }

    setAdd(){
        if(this.selector == 3){
            this.selector = 0;
            this.addactive = "";
        }
        else{
            this.selector = 3;
            this.addactive = "active";
        }
    }


    setStart(){
        if(this.selector == 1){
            this.selector = 0;
            this.startactive = "";
        }
        else{
            this.selector = 1;
            this.startactive = "active";
            this.endactive = "";
        }
    }

    setEnd(){
        if(this.selector == 2){
            this.selector = 0;
            this.endactive = "";
        }
        else{
            this.selector = 2;
            this.endactive = "active";
            this.startactive = "";
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
                }
            );
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