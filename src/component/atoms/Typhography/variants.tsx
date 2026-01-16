import React from "react";
import { TypographyProps, Typography } from "./Typography";

export const H1 = (props: Omit<TypographyProps, "variant">) => <Typography variant="h1" {...props} />;
export const H2 = (props: Omit<TypographyProps, "variant">) => <Typography variant="h2" {...props} />;
export const H3 = (props: Omit<TypographyProps, "variant">) => <Typography variant="h3" {...props} />;
export const H4 = (props: Omit<TypographyProps, "variant">) => <Typography variant="h4" {...props} />;
export const H5 = (props: Omit<TypographyProps, "variant">) => <Typography variant="h5" {...props} />;
export const H6 = (props: Omit<TypographyProps, "variant">) => <Typography variant="h6" {...props} />;
export const P = (props: Omit<TypographyProps, "variant">) => <Typography variant="p"  {...props} />;

