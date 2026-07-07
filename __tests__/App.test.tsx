/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import RideBottomSheet from '../src/components/RideBottomSheet';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<RideBottomSheet pickupAddress="Test pickup" dropoffAddress="Test dropoff" />);
  });
});

test('starts the trip only after valid OTP is submitted', () => {
  const onSubmitOtp = jest.fn();
  const onTripStart = jest.fn();
  const onTripFinished = jest.fn();
  const ref = React.createRef();

  let testRenderer;

  ReactTestRenderer.act(() => {
    testRenderer = ReactTestRenderer.create(
      <RideBottomSheet
        ref={ref}
        pickupAddress="Test pickup"
        dropoffAddress="Test dropoff"
        onSubmitOtp={onSubmitOtp}
        onTripStart={onTripStart}
        onTripFinished={onTripFinished}
      />,
    );
  });

  ReactTestRenderer.act(() => {
    ref.current.open();
  });

  const arrivedText = testRenderer.root.findByProps({ children: 'Arrived at Pick-up' });
  ReactTestRenderer.act(() => {
    arrivedText.parent.props.onPress();
  });

  const otpInput = testRenderer.root.findByProps({ placeholder: 'Enter OTP' });
  ReactTestRenderer.act(() => {
    otpInput.props.onChangeText('123456');
  });

  const submitButton = testRenderer.root.findByProps({ title: 'Submit' });
  ReactTestRenderer.act(() => {
    submitButton.props.onPress();
  });

  expect(onSubmitOtp).toHaveBeenCalledWith('123456');
  expect(onTripStart).toHaveBeenCalled();
});
