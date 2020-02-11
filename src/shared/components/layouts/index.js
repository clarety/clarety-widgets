import React from 'react';
import { StackPanelContainer, StackPanelHeader, StackPanelBody } from './stack';
import { AccordianPanelContainer, AccordianPanelHeader, AccordianPanelBody } from './accordian';
import { TabsPanelContainer, TabsPanelHeader, TabsPanelBody, TabsPanelFooter } from './tabs';
import { PagePanelContainer, PagePanelHeader, PagePanelBody, PagePanelFooter } from './page';

export const PanelContainer = ({ layout, status, className, children }) => {
  switch (layout) {
    case 'stack':     return <StackPanelContainer status={status} className={className}>{children}</StackPanelContainer>;
    case 'accordian': return <AccordianPanelContainer status={status} className={className}>{children}</AccordianPanelContainer>;
    case 'tabs':      return <TabsPanelContainer status={status} className={className}>{children}</TabsPanelContainer>;
    case 'page':      return <PagePanelContainer status={status} className={className}>{children}</PagePanelContainer>;

    default: throw new Error(`PanelContainer not implemented for layout ${layout}`);
  }  
};

export const PanelHeader = ({ layout, status, title, subtitle, number, intlId, intlValues, onPressEdit }) => {
  switch (layout) {
    case 'stack':     return <StackPanelHeader status={status} intlId={intlId} intlValues={intlValues} onPressEdit={onPressEdit} />;
    case 'accordian': return <AccordianPanelHeader status={status} number={number} title={title} onPressEdit={onPressEdit} />;
    case 'tabs':      return <TabsPanelHeader status={status} title={title} subtitle={subtitle} />;
    case 'page':      return <PagePanelHeader status={status} title={title} subtitle={subtitle} />;

    default: throw new Error(`PanelHeader not implemented for layout ${layout}`);
  }  
};

export const PanelBody = ({ layout, status, isBusy, children }) => {
  switch (layout) {
    case 'stack':     return <StackPanelBody status={status} isBusy={isBusy}>{children}</StackPanelBody>;
    case 'accordian': return <AccordianPanelBody status={status} isBusy={isBusy}>{children}</AccordianPanelBody>;
    case 'tabs':      return <TabsPanelBody status={status} isBusy={isBusy}>{children}</TabsPanelBody>;
    case 'page':      return <PagePanelBody status={status} isBusy={isBusy}>{children}</PagePanelBody>;

    default: throw new Error(`PanelBody not implemented for layout ${layout}`);
  }  
};

export const PanelFooter = ({ layout, status, isBusy, children }) => {
  switch (layout) {
    case 'tabs': return <TabsPanelFooter status={status} isBusy={isBusy}>{children}</TabsPanelFooter>;
    case 'page': return <PagePanelFooter status={status} isBusy={isBusy}>{children}</PagePanelFooter>;

    default: throw new Error(`PanelFooter not implemented for layout ${layout}`);
  }
};
