import React from 'react'

class CesiumView extends React.Component {
    initMap = (element) => {
        if (element) {
            let Cesium = window.Cesium
            let terrainProvider = new Cesium.EllipsoidTerrainProvider({
                tilingScheme: new Cesium.WebMercatorTilingScheme()
            })

            terrainProvider.requestTileGeometry = function (x, y, level, request) {
                // let url = `http://10.16.28.12:8082/datamg/mapservice/previewDem?x=${x}&y=${y}&level=${level}&code=3857&serviceId=9631813128192`;
                let url = `http://10.16.28.12:8082/datamg/services/heightmap?x=${x}&y=${y}&l=${level}&crs=EPSG:3857&serviceId=1189430230136384`;

                // let childTileMask = 15
                // if (level > 13) {
                //     childTileMask = 0
                // }


                return fetch(url)
                    .then(response => response.arrayBuffer())
                    .then(data => {
                        // data就是我们请求的repos
                        let width = 65
                        let height = 65
                        // var buffer = data
                        var heightBuffer  = new Int16Array(data, 0, width * height);
                        // console.log(heightBuffer.length, "aaa")
                        var childTileMask = new Int8Array(data, heightBuffer.byteLength, 1)[0];
                        var waterMask = new Uint8Array(data, heightBuffer.byteLength + 1, data.byteLength - heightBuffer.byteLength - 1);
                        console.log(childTileMask, "aaa")
                        if (heightBuffer.length >= width * height) {
                            return new Cesium.HeightmapTerrainData({
                                buffer: heightBuffer,
                                width: width,
                                height: height,
                                childTileMask: childTileMask,
                                waterMask: waterMask
                            })
                        } else {
                            return new Cesium.HeightmapTerrainData({
                                buffer: new Uint8Array(width * height),
                                width: width,
                                height: height,
                                childTileMask: childTileMask
                            })
                        }
                    });
            }

            this.viewer = new Cesium.Viewer('cesiumContainer', {
                timeline: false, // 是否显示时间轴 
                animation: false, // 是否创建动画小器件，左下角仪表                
                requestRenderMode: true, // 启用请求渲染模式
                scene3DOnly: true, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源 
                navigationHelpButton: false, // 是否显示右上角的帮助按钮 
                navigationInstructionsInitiallyVisible: false,
                fullscreenButton: false, // 是否显示全屏按钮 
                geocoder: false, // 是否显示geocoder小器件，右上角查询按钮 
                homeButton: false, // 是否显示Home按钮 
                selectionIndicator: false, // 是否显示选取指示器组件 
                sceneModePicker: false, // 是否显示3D/2D选择器 
                baseLayerPicker: false, // 是否显示图层选择器 
                shadows: false, // 确定阴影是否由太阳投射。
                skyAtmosphere: false, //蓝天，以及地球四肢周围的辉光。设置为false关闭。
                imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
                    // url: 'http://www.google.cn/maps/vt?lyrs=s@726&gl=cn&x={TileCol}&y={TileRow}&z={TileMatrix}',
                    url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{TileMatrix}/{TileRow}/{TileCol}',
                    layer: 'USGSShadedReliefOnly',
                    style: 'default',
                    format: 'image/png',
                    tileMatrixSetID: 'default028mm',
                    maximumLevel: 19,
                    credit: new Cesium.Credit('bluethink')
                }),
                terrainProvider: terrainProvider
            })
            // 设置鼠标操作改变
            this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH]
            this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG]

            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(120.872311, 23.71131, 10000)
            });

        }
    }
    render() {
        return (
            <div id="cesiumContainer" className='home' ref={this.initMap}>

            </div>
        )
    }
}

export default CesiumView