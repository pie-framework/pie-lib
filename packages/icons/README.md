## icons

icon sets for use in PIEs.

### Demo

```bash
    npm install
    npm run demo 
```

And navigate to [http://localhost:8080](http://localhost:8080)

### Usage

    npm install @pie-lib/icons

Import with the following:
```jsx

import {
  Correct,
  CorrectResponse,
  Incorrect,
  Instructions,
  LearnMore,
  NothingSubmitted,
  PartiallyCorrect,
  ShowRationale,
} from '@pie-lib/icons';

    //....

<CorrectIcon iconSet="emoji" shape="round"/>
<PartiallyCorrectIcon iconSet="emoji" shape="square" open={true} />
<IncorrectIcon iconSet="check" shape="square"/>
<NothingSubmittedIcon iconSet="emoji" shape="square"/>
<ShowRationaleIcon iconSet="emoji" />
<LearnMoreIcon open={true} />
<CorrectResponseIcon open={false} />
<InstructionsIcon open={true} />
```

### Using in your own library

The package provides jsx and less, you'll need to use a module bundler/processor to process these when building your own library.