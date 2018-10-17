import { Component, OnInit } from '@angular/core';
import * as ol from 'ol';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'my-app';
    map: ol.Map;
    vectorLayer: ol.vectorLayer;


    ngOnInit():void{
        var view = new ol.View({
            center: ol.proj.fromLonLat([9.201047,48.658488]),
            zoom: 14
        });

        this.map = new ol.Map({
            loadTilesWhileAnimating: true,
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                this.vectorLayer
            ],
            target: 'map',
            controls: new ol.Collection,
            view: view
        });
    }



}
