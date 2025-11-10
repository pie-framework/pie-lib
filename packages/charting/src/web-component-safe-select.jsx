import React from 'react';
import { Select } from '@mui/material';

export const WebComponentSafeTransition = React.forwardRef(({ children, in: inProp }, ref) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        if (inProp) {
            // Use RAF to ensure the element is mounted before applying the visible class
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setMounted(true);
                });
            });
        } else {
            setMounted(false);
        }
    }, [inProp]);

    if (!inProp && !mounted) {
        return null;
    }

    const style = {
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'scaleY(1) translateY(0)' : 'scaleY(0.3) translateY(-10px)',
        transition: 'opacity 350ms cubic-bezier(0.4, 0, 0.2, 1), transform 350ms cubic-bezier(0.2, 1, 0.2, 1)',
        transformOrigin: 'top center',
    };

    return (
        <div ref={ref} style={style}>
            {children}
        </div>
    );
});

/**
 * Web Component-safe Select wrapper
 *
 * Fixes MUI Select crash when used inside custom HTMLElements with createRoot(this)
 *
 * Required fixes:
 * - disablePortal: true - Keeps menu in Web Component's React tree
 * - TransitionComponent: Custom - Bypasses Grow transition's useTimeout
 *
 * Features:
 * - Dropdown-style animation (scaleY + translateY)
 * - Menu may be clipped by parent overflow: hidden
 * - Menu won't break out of scrolling containers
 *
 * @param {object} props - All standard MUI Select props
 */
export const WebComponentSafeSelect = ({ MenuProps = {}, ...props }) => {
    const ref = React.useRef(null);

    // implrement onClose and onOpen to manage focused class based on workaround for MUI bug found in stackoverflow
    const onClose = () => {
        ref.current?.previousSibling?.classList.remove('Mui-focused');
        ref.current?.classList.remove('Mui-focused');

        if (props.onClose) {
            props.onClose();
        }
    };

    const onOpen = () => {
        ref.current?.previousSibling?.classList.add('Mui-focused');
        ref.current?.classList.add('Mui-focused');

        if (props.onOpen) {
            props.onOpen();
        }
    };

    return (
        <Select
            {...props}
            ref={ref}
            autoFocus={false}
            onOpen={onOpen}
            onClose={onClose}
            MenuProps={{
                ...MenuProps,
                disablePortal: true,
                TransitionComponent: WebComponentSafeTransition,
                disableAutoFocusItem: true,
                PaperProps: {
                    style: {
                        maxHeight: '300px',
                        marginTop: '4px',
                        ...MenuProps.PaperProps?.style,
                    },
                    ...MenuProps.PaperProps,
                },
            }}
        />
    );
};

export default WebComponentSafeSelect;
