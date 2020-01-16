import React from "react";
import styled from "@emotion/styled";

export const headingFontSizeMap = {
  xlarge: 64,
  large: 48,
  medium: 40,
  regular: 32,
  small: 24,
  tiny: 16,
  xtiny: 14,
  get h1() {
    return this.large;
  },
  get h2() {
    return this.regular;
  },
  get h3() {
    return this.small;
  },
  get h4() {
    return this.tiny;
  },
  get h5() {
    return this.tiny;
  },
  get h6() {
    return this.xtiny;
  }
};

export const headingLineHeights = {
  medium: 1.15,
  regular: 1,
  small: 0.9,
  tiny: 0.8
};

headingLineHeights.h1 = headingLineHeights.medium;
headingLineHeights.h2 = headingLineHeights.medium;
headingLineHeights.h3 = headingLineHeights.tiny;
headingLineHeights.h4 = headingLineHeights.medium;
headingLineHeights.h5 = headingLineHeights.medium;

const baseHeadingStyles = `
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

export const HeadingFactory = ({
  heading,
  size,
  color,
  lineHeight,
  marginBottom
}) => {
  const headingSize = size || heading;
  const headingColor = color || "";
  return styled[heading]`
    ${baseHeadingStyles}
    color: ${headingColor};
    font-size: 12px;
    line-height: 1;
    margin-bottom: 10px;
  `;
};

// Stock headings

export const H1 = HeadingFactory({ heading: "h1" });
export const H2 = HeadingFactory({ heading: "h2" });
export const H3 = HeadingFactory({ heading: "h3" });
export const H4 = HeadingFactory({ heading: "h4" });
export const H5 = HeadingFactory({ heading: "h5" });

// Heading

const Heading = props => {
  const H = HeadingFactory(props);
  return <H className={props.className}>{props.children}</H>;
};

export default Heading;

// Fluid Headings

const fluidHeadingSize = fontSize => `${fontSize}px`;

const smallH2 = HeadingFactory({ heading: "h2", size: "h3" });

export const smallH3 = HeadingFactory({ heading: "h3", size: "h4" });

export const FluidHeading = styled(smallH2)`
  @media (min-width: 1000px) {
    font-size: ${fluidHeadingSize(headingFontSizeMap.h3)};
  }

  @media (min-width: 400px) {
    font-size: ${headingFontSizeMap.h3 * (1 + 1 / 3)}px;
  }
`;

// SectionHeading

export const HeadingContainer = styled.div``;

export const HEADING_CLASSNAME = "heading";
export const HEADING_TITLE_CLASSNAME = "heading-title";
export const HEADING_DESCRIPTION_CLASSNAME = "heading-description";

export const SectionHeading = ({ title, description, headingType }) => (
  <HeadingContainer className={HEADING_CLASSNAME}>
    <FluidHeading className={HEADING_TITLE_CLASSNAME} as={headingType}>
      {title}
    </FluidHeading>
  </HeadingContainer>
);
