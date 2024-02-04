import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react'
import { authenticate } from '~/shopify.server';

type bulkOperation = {
  id:String;
  status:String;
  url:String;
  format:String;
  createdAt:String;
  completedAt:String;
}


export const loader:LoaderFunction = async ({ request }) => {
  const {admin}= await authenticate.admin(request)
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
  `)
  if (response.ok) {
    const {data} = await response.json();
    console.log('data',data)
    return json(data.currentBulkOperation);
  }
  return null
};

function ExportResult({}) {
  const data:bulkOperation = useLoaderData<typeof loader>()

  console.log("export result component")
  console.log("laoder data",data)

  return (
    <div>ExportResult</div>
  )
}

export default ExportResult
