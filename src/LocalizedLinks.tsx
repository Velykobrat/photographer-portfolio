import type { ComponentProps } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage, localizedPath } from './localization';

export function LocalizedLink(props: ComponentProps<typeof Link>) {
  const { language } = useLanguage();
  const to = typeof props.to === 'string' && props.to.startsWith('/') ? localizedPath(props.to, language) : props.to;
  return <Link {...props} to={to} />;
}

export function LocalizedNavLink(props: ComponentProps<typeof NavLink>) {
  const { language } = useLanguage();
  const to = typeof props.to === 'string' && props.to.startsWith('/') ? localizedPath(props.to, language) : props.to;
  return <NavLink {...props} to={to} />;
}
