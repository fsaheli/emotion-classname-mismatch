import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "@emotion/styled";

import { FluidHeading } from "./Headings";

const mapStateToProps = state => ({});

const Base = () => <FluidHeading>test</FluidHeading>;

export default withRouter(connect(mapStateToProps)(Base));
