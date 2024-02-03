import { NavLink } from "@remix-run/react";
import { BlockStack, Box, Button, Card, InlineGrid, Layout, Page, Text } from "@shopify/polaris";
import React from "react";
import { CustomDropZone } from "./components/CustomDropZone";
import Placeholder from "./components/Placeholder";
import { CustomCallout } from "./components/CustomCallout";

type Props = {};

const Index = (props: Props) => {

  const calloutContent = <p>If you have any questions,issues,missing features or concerns, contact us immediatly</p>
  return (
    <Page fullWidth>
      <ui-title-bar title="Bulky Operations"></ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card roundedAbove="sm">
            <BlockStack gap="200">
              <InlineGrid columns="1fr auto">
                <Text as="h2" variant="headingSm">
                  Export
                </Text>
                <NavLink to={'/app/exportform'}>
                  <Button
                    variant="plain"
                    accessibilityLabel="New export"
                  >
                    New export
                  </Button>
                </NavLink>
              </InlineGrid>
              <Text as="p" variant="bodyMd">
                You will be able to select the particular data items to export
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card roundedAbove="sm">
            <BlockStack gap="200">
              <InlineGrid>
                <Text as="h2" variant="headingSm">
                  Import
                </Text>
              </InlineGrid>
              <CustomDropZone />
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <Box background="bg-fill-info" borderRadius="100" padding="200">
              <Placeholder label="You have 0 scheduled jobs" childAlign="start" />
            </Box>
          </Card>
        </Layout.Section>
        <Text as="h1" variant="headingLg">Helps</Text>
        <Layout.Section >
          <CustomCallout title={"Support"} illustration={"https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"} primaryAction={{url:'',content:'Contact support'}} children={calloutContent}>

          </CustomCallout>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
