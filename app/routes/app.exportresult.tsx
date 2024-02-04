import { LoaderFunction, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Badge,
  Banner,
  BlockStack,
  Layout,
  List,
  Page,
  ProgressBar,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { authenticate } from "~/shopify.server";
import Papa from 'papaparse';
import axios from "axios";


type bulkOperation = {
  id: String;
  status: String;
  url: String;
  format: String;
  createdAt: String;
  completedAt: String;
  objectCount: Number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(`#graphql
    query {
      currentBulkOperation{
        id
        status
        query
        url
        rootObjectCount
        type
        createdAt
        fileSize
        partialDataUrl
        objectCount
        completedAt
      }
    }
  `);
  if (response.ok) {
    const { data } = await response.json();
    return json(await data.currentBulkOperation);
  }
  return null;
};

function ExportResult({}) {
  const data: bulkOperation = useLoaderData<typeof loader>();

  const [pollingData, setPollingData] = useState<bulkOperation>(data);
  const [shouldPoll, setShouldPoll] = useState(true);

  const fetcher = useFetcher();

  useEffect(() => {
    if (document.visibilityState === "visible" && shouldPoll) {
      const interval = setInterval(async () => {
        fetcher.load("/app/exportresult");
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [shouldPoll, fetcher]);

  useEffect(() => {
    if (fetcher.data) {
      setPollingData(fetcher.data as bulkOperation);
      const { status } = fetcher.data as bulkOperation;
      if (status === "COMPLETED" || status === "FAILED") {
        setShouldPoll(false);
      }
    }
  }, [fetcher.data]);

  const downloadData = async () => {
      try {
        const response = await axios.get(pollingData.url.toString());
        const {data} = response;

        const jsonData = data.split('\n').filter(Boolean).map(JSON.parse);

        const csv = Papa.unparse(jsonData);
        const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const csvURL = window.URL.createObjectURL(csvData);
        const tempLink = document.createElement('a');

        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'export.csv');
        tempLink.click();
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <Page>
      <ui-title-bar title="Bulky Export">
        <button onClick={() => console.log("Secondary action")}>Back</button>
        <button
          variant="primary"
          onClick={() => console.log("Secondary action")}
        >
          Export result
        </button>
      </ui-title-bar>
      {pollingData.status === "RUNNING" && (
        <Layout>
          <Layout.Section>
            <Banner title="Download on progress please wait">
              <BlockStack gap="500">
                <ProgressBar progress={75} />
                <List type="bullet">
                  <List.Item>
                    <Badge progress="incomplete" tone="attention">
                      {pollingData.status.toString()}
                    </Badge>
                  </List.Item>
                  <List.Item>Id: {pollingData.id}</List.Item>
                  <List.Item>Format: {pollingData.format}</List.Item>
                </List>
              </BlockStack>
            </Banner>
          </Layout.Section>
        </Layout>
      )}

    {pollingData.status === "COMPLETED" && (
      <Layout>
        <Layout.Section>
          <Banner title="Download completed" tone="success"  action={{content: 'Download exported data', onAction:downloadData}}>
            <BlockStack gap="500">
              <List type="bullet">
                <List.Item>Id: {pollingData.id}</List.Item>
                <List.Item>Lign numbers: {pollingData.objectCount.toString()}</List.Item>
                <List.Item>CreateAt: {pollingData.createdAt}</List.Item>
                <List.Item>CompletedAt: {pollingData.completedAt}</List.Item>
              </List>
            </BlockStack>
          </Banner>
        </Layout.Section>
      </Layout>
    )}
    </Page>
  );
}

export default ExportResult;
