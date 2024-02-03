import {CalloutCard} from '@shopify/polaris';
import React from 'react';

interface PrimaryAction {
  content: string;
  url: string;
}

interface Props {
  title: string;
  illustration: string;
  primaryAction: PrimaryAction;
  children:React.ReactNode
}

export function CustomCallout({title, illustration, primaryAction,children}: Props) {
  return (
    <CalloutCard
      title={title}
      illustration={illustration}
      primaryAction={primaryAction}
    >
      {children}
    </CalloutCard>
  );
}
