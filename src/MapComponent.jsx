// MapComponent.js
import React, { useEffect, useReducer, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Graphic from '@arcgis/core/Graphic'
import Legend from '@arcgis/core/widgets/Legend'
import { mapReducer, initialState } from './mapReducer';
import QueryPanel from './QueryPanel';

const MapComponent = () => {
  //const [distance, setDistance]=useState(null)
  //const [units, setUnits]=useState(null)
  let distance = null;
  let units = null;
  const queryChange =(e)=>{
      switch (e.target.value) {
            // values set for distance query
            case "distance":
              distance = 0.5;
              units = "miles";
              //setDistance(0.5);
              //setUnits("miles");
              break;
            default:
              //setDistance(null);
              //setUnits(null);
              distance = null;
              units = null;
              break;
  }}
  const [state, dispatch] = useReducer(mapReducer, initialState);
  const mapref=useRef(null)
  useEffect(() => {
    if(mapref.current){
        const layer = new FeatureLayer({
          // autocasts as new PortalItem()
          portalItem: {
            id: "234d2e3f6f554e0e84757662469c26d3"
          },
          outFields: ["*"]
        });

        const map = new Map({
          basemap: "gray-vector",
          layers: [layer]
        });

        const view = new MapView({
          container: mapref.current,
          map: map,
          popupEnabled: false,
          popup: {
            dockEnabled: true,
            dockOptions: {
              // dock popup at bottom-right side of view
              buttonEnabled: false,
              breakpoint: false,
              position: "bottom-right"
            }
          }
        });

        const legend = new Legend({
          view: view,
          layerInfos: [
            {
              layer: layer
            }
          ]
        });

        view.ui.add(legend, "bottom-left");
        view.ui.add("optionsDiv", "top-right");

        // additional query fields initially set to null for basic query
        //let distance = null;
        //let units = null;

        //create graphic for mouse point click
        const pointGraphic = new Graphic({
          symbol: {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: [0, 0, 139],
            outline: {
              color: [255, 255, 255],
              width: 1.5
            }
          }
        });

        // Create graphic for distance buffer
        const bufferGraphic = new Graphic({
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [173, 216, 230, 0.2],
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: [255, 255, 255],
              width: 1
            }
          }
        });

        /*when query type changes, set appropriate values
        const queryOpts = document.getElementById("query-type");

        queryOpts.addEventListener("change", () => {
          switch (queryOpts.value) {
            // values set for distance query
            case "distance":
              distance = 0.5;
              units = "miles";
              break;
            default:
              // Default set to basic query
              distance = null;
              units = null;
          }
        }); */
        layer.load().then(() => {
          // Set the view extent to the data extent
          view.extent = layer.fullExtent;
          layer.popupTemplate = layer.createPopupTemplate();
        });

        view.on("click", (event) => {
          view.graphics.remove(pointGraphic);
          if (view.graphics.includes(bufferGraphic)) {
            view.graphics.remove(bufferGraphic);
          }
          queryFeatures(event);
        });

        function queryFeatures(screenPoint) {
          const point = view.toMap(screenPoint);
          layer
            .queryFeatures({
              geometry: point,
              // distance and units will be null if basic query selected
              distance: distance,
              units: units,
              spatialRelationship: "intersects",
              returnGeometry: false,
              returnQueryGeometry: true,
              outFields: ["*"]
            })
            .then((featureSet) => {
              // set graphic location to mouse pointer and add to mapview
              pointGraphic.geometry = point;
              view.graphics.add(pointGraphic);
              // open popup of query result
              view.openPopup({
                location: point,
                features: featureSet.features,
                featureMenuOpen: true
              });
              if (featureSet.queryGeometry) {
                bufferGraphic.geometry = featureSet.queryGeometry;
                view.graphics.add(bufferGraphic);
              }
            });
             dispatch({ type: 'SET_MAP', payload: map });
            dispatch({ type: 'SET_VIEW', payload: view });
            dispatch({ type: 'SET_LAYER', payload: layer });
        }
     
    }    
  }, [mapref]);

  return <>
  <div ref={mapref} style={{ height: '100vh', width: '100%' }}></div>;
  <QueryPanel onChange={queryChange}/>
  </>
};

export default MapComponent;
