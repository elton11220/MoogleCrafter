declare namespace MapUtils {
  interface EorzeaMap {
    create: (element: HTMLElement) => Promise<EorzeaMapInstance>;
    loader: EorzeaMapLoader;
    simpleMarker: (
      x: number,
      y: number,
      iconUrl: string,
      mapInfo: EorzeaMapInstance["mapInfo"]
    ) => EorzeaMapMarker;
    setCdnUrl: (url: string) => void;
  }

  interface EorzeaMapMarker {
    _latlng: {
      lat: number;
      lng: number;
    };
    _icon: {
      currentSrc: string;
      src: string;
    };
  }

  interface EorzeaMapInfo {
    "#": string;
    id: string;
    mapCondition: string;
    mapIndex: number;
    mapMarkerRange: number;
    placeName: string;
    "placeName{Region}": string;
    "placeName{Sub}": string;
    priorityCategoryUI: number;
    priorityUI: number;
    sizeFactor: number;
    "offset{X}": number;
    "offset{Y}": number;
    territoryType: string;
  }

  interface EorzeaMapLoader {
    getIconUrl: (iconPath: string) => string;
  }

  type LatLngPair = [number, number];

  interface EorzeaMapInstance {
    loadMapKey: (mapId: number) => Promise<void>;
    addMarker: (marker: EorzeaMapMarker) => void;
    setView: (latLng: LatLngPair, zoom: number) => void;
    mapToLatLng2D: (x: number, y: number) => LatLngPair;
    mapInfo: EorzeaMapInfo;
  }
}
