import { noSelect } from '@pie-lib/style-utils';

export { noSelect };

export const strokeColor = theme => `var(--ruler-stroke, ${theme.palette.primary.main})`;

export const fillColor = theme => `var(--ruler-bg, ${theme.palette.primary.contrastText})`;
