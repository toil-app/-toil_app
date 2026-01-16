export interface Font {
  regular?: string;
  italic?: string;

  bold?: string;
  semiBold?: string;
  medium?: string;
  light?: string;
  extraLight?: string;

  boldItalic?: string;
  semiBoldItalic?: string;
  mediumItalic?: string;
  lightItalic?: string;
  extraLightItalic?: string;

  thin?: string;
  thinItalic?: string;
  extraBold?: string;
  extraBoldItalic?: string;

  size?: {
    XXXXS?: number;
    XXXS?: number;
    XXS?: number;
    XS?: number;
    S?: number;
    M?: number;
    L?: number;
    X?: number;
    XXL?: number;
    XXXL?: number;
  };
}

export type Shade =
  | 150
  | 125
  | 100
  | 75
  | 50
  | 25
  | 15
  | 10
  | { custom: number };
