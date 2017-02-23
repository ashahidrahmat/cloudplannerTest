let Basemap3DConfig = {
    Mapbox:{
        config: {
            style: '',
            center: [103.8466, 1.2767],
            zoom: 15,
            bearing: -12,
            pitch: 60,
            maxBounds: [[103.390274,1.12328],[104.149704,1.569475]],
        },
        layers:{
            buildings: {
                'id': '3d-buildings',
                'source': 'mapbox',
                'source-layer': 'building',
                'type': 'fill-extrusion',
                'paint': {
                    'fill-extrusion-color': '#aaa',
                    'fill-extrusion-height': {
                        'type': 'identity',
                        'property': 'height'
                    },
                    'fill-extrusion-base': {
                        'type': 'identity',
                        'property': 'min_height'
                    },
                    'fill-extrusion-opacity': 0.7
                }
            },
            selectedBuildings: {
                'id': '3d-buildings-selected',
                'source': 'mapbox',
                'source-layer': 'building',
                'type': 'fill-extrusion',
                'paint': {
                    'fill-extrusion-color': '#aaa',
                    'fill-extrusion-height': {
                        'type': 'identity',
                        'property': 'height'
                    },
                    'fill-extrusion-base': {
                        'type': 'identity',
                        'property': 'min_height'
                    },
                    'fill-extrusion-opacity': 1
                },
                'filter': ['==', 'height', '']
            }
        }
    }
}

export default Basemap3DConfig;