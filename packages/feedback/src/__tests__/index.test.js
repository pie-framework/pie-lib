describe('feedback', () => {
  describe('getFeedback', () => {
    const assert = () => {
      it(` -> ${expected}`, async (correctness, config, expected) => {
        const result = await getFeedback(correctness, config);
        expect(result).toEqual(expected);
      });
    };

    assert(
      'correct',
      {
        correct: {
          type: 'default'
        }
      },
      'Correct'
    );
  });
});
