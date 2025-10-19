type SwissToolsProps = React.SVGProps<SVGSVGElement>;

const SwissTools = (props: SwissToolsProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={100} height={100} {...props}>
      <g id="Layer 1">
        <path
          id="Path 0"
          className="s0 fill-foreground custom-transition-color"
          d="m8 82.12 16.26-19.89h21.65l3.62-4.22-4.09-5.14-14.27-.12-13.46-16.03L31.52 18h60.72v.12L78.55 37.77l-3.74.24v29.36L59.95 82.23l-51.83.12H8z"
        />
        <path
          id="Path 1"
          className="s1 fill-background custom-transition-color"
          d="m34.68 23.15 47.85.23-6.67 9.36h-6.32v32.29l-6.32 6.32V32.74H38.65l-3.62 5.03 22.81.24v39.08H19.35l7.6-9.37H48.6l6.9-7.48-.12-4.68-6.66-8.19H34.44l-9.48-11z"
        />
      </g>
    </svg>
  );
};

export default SwissTools;
