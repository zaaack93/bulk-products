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

type bulkOperation = {
  id: String;
  status: String;
  url: String;
  format: String;
  createdAt: String;
  completedAt: String;
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
      <p>Export result</p>
      <p>Id: {pollingData.id}</p>
      <p>Status: {pollingData.status}</p>
      <p>Url: {pollingData.url}</p>
      <p>Format: {pollingData.format}</p>
      <p>Created at: {pollingData.createdAt}</p>
      <p>Completed at: {pollingData.completedAt}</p>
    </Page>
  );
}

export default ExportResult;
