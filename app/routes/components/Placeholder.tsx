import { InlineStack, Text } from "@shopify/polaris";

const Placeholder = ({
  label = '',
  childAlign,
}: {
  label?: string;
  childAlign: 'start' | 'center' | 'end';
}) => {
  return (
    <div
    >
      <InlineStack gap="400" align={childAlign}>
        <div>
          <Text
            as="p"
          >
            {label}
          </Text>
        </div>
      </InlineStack>
    </div>
  );
};

export default Placeholder;
