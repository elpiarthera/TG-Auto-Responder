import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Button, ButtonProps } from './button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['default', 'sm', 'lg'],
      },
    },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Button',
  variant: 'default',
  size: 'default',
};

export const Destructive = Template.bind({});
Destructive.args = {
  children: 'Delete',
  variant: 'destructive',
};

export const Outline = Template.bind({});
Outline.args = {
  children: 'Outline',
  variant: 'outline',
};

export const WithAriaLabel = Template.bind({});
WithAriaLabel.args = {
  children: 'Accessible Button',
  'aria-label': 'This is an accessible button',
};