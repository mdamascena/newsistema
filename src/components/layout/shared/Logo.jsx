'use client';

// React Imports
import { useEffect, useRef } from 'react';

// Next Imports
import Image from 'next/image';

// Third-party Imports
import styled from '@emotion/styled';

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav';
import { useSettings } from '@core/hooks/useSettings';

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    transition: opacity 0.3s ease-in-out;
`;

const LogoImage = styled(Image)`
    height: auto;
    width: auto;
`;

const LogoText = styled.span`
    color: ${({ color }) => color ?? 'var(--mui-palette-text-primary)'};
    font-size: 1.375rem;
    line-height: 1.09091;
    font-weight: 700;
    letter-spacing: 0.25px;
    transition: ${({ transitionDuration }) =>
        `margin-inline-start ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`};

    ${({ isHovered, isCollapsed, isBreakpointReached }) =>
        !isBreakpointReached && isCollapsed && !isHovered
            ? 'opacity: 0; margin-inline-start: 0;'
            : 'opacity: 1; margin-inline-start: 12px;'}
`;

const Logo = ({ color }) => {
    // Refs
    const logoTextRef = useRef(null);

    // Hooks
    const { isHovered, transitionDuration, isBreakpointReached } = useVerticalNav();
    const { settings } = useSettings();

    // Vars
    const { layout, mode } = settings;
    const isDarkMode = mode === 'dark';
    const isCollapsed = layout === 'collapsed';
    const isTemporarilyExpanded = isCollapsed && isHovered && !isBreakpointReached;
    const showExpandedLogo = !isCollapsed || isTemporarilyExpanded;

    // Tamanhos da logo
    const logoWidth = showExpandedLogo ? 120 : 32;
    const logoHeight = showExpandedLogo ? 40 : 45;

    // Determine which logo to show
    const logoSrc = showExpandedLogo
        ? isDarkMode
            ? '/images/logos/logowhite.png'
            : '/images/logos/logoblue.png'
        : isDarkMode
          ? '/images/logos/symbolwhite.png'
          : '/images/logos/symbolblue.png';

    useEffect(() => {
        if (layout !== 'collapsed') {
            return;
        }

        if (logoTextRef && logoTextRef.current) {
            if (!isBreakpointReached && layout === 'collapsed' && !isHovered) {
                logoTextRef.current?.classList.add('hidden');
            } else {
                logoTextRef.current.classList.remove('hidden');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHovered, layout, isBreakpointReached]);

    return (
        <LogoContainer className="flex items-center">
            <LogoImage src={logoSrc} alt="logo" height={logoHeight} width={logoWidth} priority />
            <LogoText
                color={color}
                ref={logoTextRef}
                isHovered={isHovered}
                isCollapsed={isCollapsed}
                transitionDuration={transitionDuration}
                isBreakpointReached={isBreakpointReached}
            >
                {/* Adicionar nome do template se desejar */}
            </LogoText>
        </LogoContainer>
    );
};

export default Logo;
