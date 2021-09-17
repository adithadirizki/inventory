export const Button = () => {
  return (
    <button className="bg-indigo-500 hover:bg-indigo-400 text-indigo-100 rounded focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5">
      Filled
    </button>
  );
};

export const ButtonLight = () => {
  return (
    <button className="border border-indigo-300 bg-indigo-50 hover:bg-indigo-200 text-indigo-600 rounded-full focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5">
      Light
    </button>
  );
};

export const ButtonOutline = () => {
  return (
    <button className="border border-indigo-300 hover:bg-indigo-50 text-indigo-600 rounded disabled:opacity-50 disabled:cursor-default focus:ring focus:ring-indigo-100 focus:outline-none px-4 py-1.5">
      Outline
    </button>
  );
};
