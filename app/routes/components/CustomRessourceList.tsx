import { LegacyCard, ResourceItem, ResourceList, Text } from "@shopify/polaris";
import { ResourceListSelectedItems } from "@shopify/polaris/build/ts/src/utilities/resource-list";
import React from "react";
interface CustomRessourceItemProps {
  id: string;
  title: string;
}

interface RessourceListProps {
  items: CustomRessourceItemProps[];
  selectedItems: ResourceListSelectedItems | undefined;
  onSelectedItems:
    | ((selectedItems: ResourceListSelectedItems) => void)
    | undefined;
}

export const itemsResource: CustomRessourceItemProps[] = [
  {
    id: "products",
    title: "Products",
  },
  {
    id: "customers",
    title: "Customers",
  },
  {
    id: "orders",
    title: "Orders",
  },
];

const CustomRessourceList = (props: RessourceListProps) => {
  const { items, selectedItems, onSelectedItems } = props;
  return (
    <LegacyCard>
      <ResourceList
        resourceName={{ singular: "product", plural: "products" }}
        items={items}
        renderItem={(item) => {
          const {id, title} = item;
          return (
            <ResourceItem
              id={id}
              accessibilityLabel={`View details for ${name}`}
              onClick={(id) => {
                console.log("clicked",id);
              }}
              name={title}
            >
              <Text variant="bodyMd" fontWeight="bold" as="h3">
                {title}
              </Text>
            </ResourceItem>
          );
        }}
        selectedItems={selectedItems}
        onSelectionChange={onSelectedItems}
        selectable
      />
    </LegacyCard>
  );
};

export default CustomRessourceList;
