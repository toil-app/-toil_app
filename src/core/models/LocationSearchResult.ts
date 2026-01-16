// LocationSearchResult.ts
// Model for location search API response (FeatureCollection)

export interface LocationFeature {
  type: 'Feature';
  properties: {
    ref?: string;
    country_code?: string;
    wikidata?: string;
    kind?: string;
    place_type_name?: string[];
    place_type?: string[];
    [key: string]: any;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  bbox?: [number, number, number, number];
  center?: [number, number];
  place_name: string;
  place_type: string[];
  relevance: number;
  id: string;
  text: string;
  address?: string;
  text_en?: string;
  place_name_en?: string;
  context?: any[];
}

export interface LocationSearchResult {
  type: 'FeatureCollection';
  features: LocationFeature[];
  query?: any[];
  attribution?: string;
}
