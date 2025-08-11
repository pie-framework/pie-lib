import * as React from 'react';
import { hasMedia } from '../has-media'; // Assuming you have a hasMedia function

describe('hasMedia', () => {
  it.each`
    input                                     | expected
    ${'<img src="image.jpg" />'}              | ${true}
    ${'<audio src="audio.mp3" />'}            | ${true}
    ${'<div><img src="image.jpg" /></div>'}   | ${true}
    ${'<div><audio src="audio.mp3" /></div>'} | ${true}
    ${'<div>No media here</div>'}             | ${false}
    ${'<div></div>'}                          | ${false}
    ${' '}                                    | ${false}
    ${null}                                   | ${false}
  `('$input -> $expected', ({ input, expected }) => {
    const output = hasMedia(input);

    expect(output).toEqual(expected);
  });
});
