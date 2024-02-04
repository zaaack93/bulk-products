export const productsQuery = `
  {
    products {
      node {
        edges {
          handle
          id
          descriptionHtml
          tags
          title
          status
          vendor
          updatedAt
          templateSuffix
          publishedAt
        }
      }
    }
  }
`;
