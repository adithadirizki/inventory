export const Button = ({
  children,
  className = "",
  theme = "indigo",
  variant = "flat",
  ...props
}) => {
  theme = `bg-${theme}-500 hover:bg-${theme}-400 text-${theme}-100 disabled:opacity-50 focus:ring focus:ring-${theme}-100`;
  switch (variant) {
    case "flat":
      variant = "rounded";
      break;
    case "pill":
      variant = "rounded-full";
      break;
    default:
      variant = "rounded";
      break;
  }

  return (
    <button
      className={`${className} ${theme} ${variant} focus:outline-none px-4 py-1.5`}
      {...props}>
      {children}
    </button>
  );
};

export const ButtonLight = ({
  children,
  className = "",
  theme = "indigo",
  variant = "flat",
  ...props
}) => {
  theme = `border border-${theme}-300 bg-${theme}-50 hover:bg-${theme}-200 text-${theme}-600 disabled:opacity-50 focus:ring focus:ring-${theme}-100`;
  switch (variant) {
    case "flat":
      variant = "rounded";
      break;
    case "pill":
      variant = "rounded-full";
      break;
    default:
      variant = "rounded";
      break;
  }
  return (
    <button
      className={`${className} ${theme} ${variant} focus:outline-none px-4 py-1.5`}
      {...props}>
      {children}
    </button>
  );
};

export const ButtonOutline = ({
  children,
  className = "",
  theme = "indigo",
  variant = "flat",
  ...props
}) => {
  theme = `border border-${theme}-300 hover:bg-${theme}-50 text-${theme}-600 disabled:opacity-50 disabled:cursor-default focus:ring focus:ring-${theme}-100`;
  switch (variant) {
    case "flat":
      variant = "rounded";
      break;
    case "pill":
      variant = "rounded-full";
      break;
    default:
      variant = "rounded";
      break;
  }
  return (
    <button
      className={`${className} ${theme} ${variant} focus:outline-none px-4 py-1.5`}
      {...props}>
      {children}
    </button>
  );
};