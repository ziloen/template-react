

## Types

### `React.FC` instead of `React.FunctionComponent`

```tsx
// bad
const App: React.FunctionComponent<Props> = () => {
  return <div />;
};

// good
const App: React.FC<Props> = () => {
  return <div />;
};
```

### `React.ComponentProps` instead of `React.DetailedHTMLProps`

```tsx
// bad
const App = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return <div {...props} />;
};

// good
const App = (props: React.ComponentProps<'div'>) => {
  return <div {...props} />;
};
```

### `React.ElementRef<typeof Component>` instead of `import { ComponentRefType } from "./Component"`

```tsx
// bad
import { Component, type ComponentRefType } from "./Component";

const App = () => {
  const ref = useRef<ComponentRefType>(null);

  return <Component ref={ref} />;
};

// good
const App = () => {
  const ref = useRef<React.ElementRef<typeof Component>>(null);

  return <Component ref={ref} />;
};
```