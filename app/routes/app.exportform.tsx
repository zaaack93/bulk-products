import { Button, Card, Layout, Page, Popover, Text } from '@shopify/polaris'
import React, { useCallback, useState } from 'react'
import CustomRessourceList, { itemsResource } from './components/CustomRessourceList';
import { redirect, useSubmit } from '@remix-run/react';
import { ActionFunctionArgs } from '@remix-run/node';
import { authenticate } from '~/shopify.server';
import { productsQuery } from '~/graphql/productsQuery';

type Props = {}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request)
  const formData = await request.formData();

  const response = await admin.graphql(`
    mutation {
      bulkOperationRunQuery(
        query: """
          ${productsQuery}
        """
      ) {
        bulkOperation {
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
        userErrors {
          field
          message
        }
      }
    }
  `)

  if(response.ok){
    const data = await response.json()

    console.log("from epxort ",data.data.bulkOperationRunQuery.userErrors)
    return redirect("/app/exportresult");
  }

  return null
};

const ExportForm = (props: Props) => {
  const submit= useSubmit()
  const [popoverActive, setPopoverActive] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // [id1, id2, ...


  console.log(selectedItems)
  //preventing creating a new function on every render
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const createExport = useCallback(
    () => {
      submit({},{
        method: 'POST',
        action: '/app/exportform',
        replace: true
      })
    },
    [],
  );
  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      Select sheets
    </Button>
  );


  return (
    <Page fullWidth>
      <ui-title-bar title="New Export">
      <button onClick="console.log('Secondary action')">Back</button>
      <button variant="primary" onClick={createExport}>
        Export
      </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card roundedAbove="sm">
              <Text as="h3" variant="headingMd">
                Format: CSV
              </Text>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card roundedAbove="sm">
          <Popover
            active={popoverActive}
            activator={activator}
            autofocusTarget="first-node"
            onClose={togglePopoverActive}
          >
            <CustomRessourceList items={itemsResource} selectedItems={selectedItems} onSelectedItems={setSelectedItems}></CustomRessourceList>
          </Popover>
          </Card>
        </Layout.Section>
      </Layout>

    </Page>
  )
}

export default ExportForm
