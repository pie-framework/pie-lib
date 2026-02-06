import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider as UidProvider, withUid } from '../uid-context';

describe('uid-context', () => {
  describe('withUid', () => {
    it('provides uid to wrapped component', () => {
      const TestComponent = ({ uid }) => <div data-testid="test-uid">{uid}</div>;
      const WrappedComponent = withUid(TestComponent);

      render(
        <UidProvider value="test-uid-123">
          <WrappedComponent />
        </UidProvider>,
      );

      expect(screen.getByTestId('test-uid')).toHaveTextContent('test-uid-123');
    });

    it('passes through other props to wrapped component', () => {
      const TestComponent = ({ uid, customProp }) => (
        <div>
          <span data-testid="uid">{uid}</span>
          <span data-testid="custom">{customProp}</span>
        </div>
      );
      const WrappedComponent = withUid(TestComponent);

      render(
        <UidProvider value="test-uid">
          <WrappedComponent customProp="custom-value" />
        </UidProvider>,
      );

      expect(screen.getByTestId('uid')).toHaveTextContent('test-uid');
      expect(screen.getByTestId('custom')).toHaveTextContent('custom-value');
    });
  });

  describe('UidProvider', () => {
    it('provides uid context to children', () => {
      const TestComponent = ({ uid }) => <div data-testid="uid-value">{uid}</div>;
      const WrappedComponent = withUid(TestComponent);

      render(
        <UidProvider value="provider-uid">
          <WrappedComponent />
        </UidProvider>,
      );

      expect(screen.getByTestId('uid-value')).toHaveTextContent('provider-uid');
    });
  });
});
