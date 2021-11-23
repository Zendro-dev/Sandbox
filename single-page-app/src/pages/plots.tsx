import { ModelLayout, PageWithLayout } from '@/layouts';
import React, { useEffect, useState } from 'react';

import { useZendroClient } from '@/hooks';

import { QueryVariables } from '@/types/queries';

import { DataRecord } from '@/types/models';
import { PageInfo } from '@/types/requests';

import { Data, Layout } from 'plotly.js';
import dynamic from 'next/dynamic';

const PlotlyPlot = dynamic(() => import('@/zendro/plots/plot'), {
  ssr: false,
});

const Plots: PageWithLayout = () => {
  const zendro = useZendroClient();

  const variables: QueryVariables = {
    pagination: { first: 20 },
  };

  const layout: Partial<Layout> = {
    yaxis: {
      title: 'length / km',
      zeroline: false,
    },
    title: 'River length in kilometres',
    autosize: true,
  };

  const [data, setData] = useState<Partial<Data>[]>([]);

  useEffect(() => {
    let active = true;
    loadData();
    return () => {
      active = false;
    };

    async function loadData(): Promise<void> {
      const { query, transform } = zendro.queries['river'].readAll;
      const data = await zendro.request<{
        pageInfo: PageInfo;
        records: DataRecord[];
      }>(query, { jq: transform, variables });
      const x = data.records.map((record) => record.name) as string[];
      const y = data.records.map((record) => record['length']) as number[];
      const plotlyData: Partial<Data> = { x, y, type: 'bar' };
      setData([plotlyData]);
    }
  }, []);

  return <PlotlyPlot data={data} layout={layout}></PlotlyPlot>;
};

Plots.layout = ModelLayout;

export default Plots;
