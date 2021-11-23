import React from 'react';
import Plot from 'react-plotly.js';

import { Layout, Data } from 'plotly.js';

const PlotlyPlot: React.FC<{
  data: Partial<Data>[];
  layout: Partial<Layout>;
}> = ({ data, layout }) => {
  return <Plot data={data} layout={layout} useResizeHandler={true} />;
};

export default PlotlyPlot;
