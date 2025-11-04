'use client';

import { Cookie } from 'lucide-react';
import React, { ReactNode } from 'react';

import { ButtonBase } from '@/components/ui/button-base';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CookieConsentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'small' | 'mini';
  title: string;
  description: string | ReactNode;
  descriptionClassName?: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryCallback: () => void;
  onSecondaryCallback: () => void;
  demo?: boolean;
  learnMoreHref?: string;
  learnMoreLabel?: string;
}

const CookieConsent = React.forwardRef<HTMLDivElement, CookieConsentProps>(
  (
    {
      variant = 'default',
      demo = false,
      className,
      title,
      description,
      descriptionClassName,
      primaryLabel,
      secondaryLabel,
      learnMoreHref = '#',
      learnMoreLabel,
      onPrimaryCallback: onAcceptCallback = () => {},
      onSecondaryCallback: onDeclineCallback = () => {},
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [hide, setHide] = React.useState(false);

    const handlePrimary = React.useCallback(() => {
      setIsOpen(false);
      document.cookie = 'cookieConsent=analytics; expires=Fri, 31 Dec 9999 23:59:59 GMT';
      setTimeout(() => setHide(true), 700);
      onAcceptCallback();
    }, [onAcceptCallback]);

    const handleSecondary = React.useCallback(() => {
      setIsOpen(false);
      document.cookie = 'cookieConsent=full; expires=Fri, 31 Dec 9999 23:59:59 GMT';
      setTimeout(() => setHide(true), 700);
      onDeclineCallback();
    }, [onDeclineCallback]);

    React.useEffect(() => {
      try {
        setIsOpen(true);
        const hasConsent = /cookieConsent=(analytics|full)/.test(document.cookie);
        if (hasConsent && !demo) {
          setIsOpen(false);
          setTimeout(() => setHide(true), 700);
        }
      } catch (error) {
        console.warn('Cookie consent error:', error);
      }
    }, [demo]);

    if (hide) {
      return null;
    }

    const containerClasses = cn(
      'fixed z-50 transition-transform duration-700',
      !isOpen ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100',
      className
    );

    const commonWrapperProps = {
      ref,
      className: cn(
        containerClasses,
        variant === 'mini'
          ? 'left-1/2 bottom-4 w-full sm:w-auto sm:max-w-3xl -translate-x-1/2'
          : 'left-1/2 bottom-0 sm:bottom-1 w-full md:max-w-2xl -translate-x-1/2'
      ),
      ...props,
    };

    if (variant === 'default') {
      return (
        <div {...commonWrapperProps}>
          <Card className="m-3 shadow-lg gap-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 custom-transition-color">
              <CardTitle className="text-lg">{title}</CardTitle>
              <Cookie className="h-5 w-5" />
            </CardHeader>
            <CardContent className="space-y-2">
              <CardDescription className={cn('text-sm', descriptionClassName)}>{description}</CardDescription>
              {learnMoreLabel && (
                <a
                  href={learnMoreHref}
                  className="text-xs text-primary underline underline-offset-4 hover:no-underline custom-transition-color"
                >
                  {`${learnMoreLabel} ↗`}
                </a>
              )}
            </CardContent>
            <CardFooter className="flex gap-2 pt-2">
              <ButtonBase onClick={handleSecondary} variant="secondary" className="flex-1">
                {secondaryLabel}
              </ButtonBase>
              <ButtonBase onClick={handlePrimary} className="flex-1">
                {primaryLabel}
              </ButtonBase>
            </CardFooter>
          </Card>
        </div>
      );
    }

    if (variant === 'small') {
      return (
        <div {...commonWrapperProps}>
          <Card className="m-3 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-0 px-4">
              <CardTitle className="text-base">{title}</CardTitle>
              <Cookie className="h-4 w-4" />
            </CardHeader>
            <CardContent className="pt-0 pb-2 px-4">
              <CardDescription className={cn('text-sm', descriptionClassName)}>{description}</CardDescription>
            </CardContent>
            <CardFooter className="flex gap-2 h-0 py-2 px-4">
              <ButtonBase onClick={handleSecondary} variant="secondary" size="sm" className="flex-1 rounded-full">
                {secondaryLabel}
              </ButtonBase>
              <ButtonBase onClick={handlePrimary} size="sm" className="flex-1 rounded-full">
                {primaryLabel}
              </ButtonBase>
            </CardFooter>
          </Card>
        </div>
      );
    }

    if (variant === 'mini') {
      return (
        <div {...commonWrapperProps}>
          <Card className="mx-3 p-0 py-3 shadow-lg">
            <CardContent className="sm:flex grid gap-4 p-0 px-3.5">
              <CardDescription className={cn('text-sm', descriptionClassName)}>{description}</CardDescription>
              <div className="flex items-center gap-2 justify-end sm:gap-3">
                <ButtonBase onClick={handleSecondary} size="sm" variant="secondary" className="text-xs h-7">
                  {secondaryLabel}
                  <span className="sr-only sm:hidden">{secondaryLabel}</span>
                </ButtonBase>
                <ButtonBase onClick={handlePrimary} size="sm" className="text-xs h-7">
                  {primaryLabel}
                  <span className="sr-only sm:hidden">{primaryLabel}</span>
                </ButtonBase>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  }
);

CookieConsent.displayName = 'CookieConsent';
export { CookieConsent };
export default CookieConsent;
