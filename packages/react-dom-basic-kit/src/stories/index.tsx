import React from 'react'
import { storiesOf } from '@storybook/react'
import { ToggleToast } from './Container'
import FormTest from './Form'
import { ToggleModal } from './Modal'

storiesOf('Container', module)
  .add('toggle toast', () => <ToggleToast />)
  .add('toggle modal', () => <ToggleModal />)
  .add('form', () => <FormTest />)
