declare global {
  namespace JSX {
    interface IntrinsicElements {
      [`sgds-masthead`]: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export default () => {
  return <sgds-masthead />;
};
