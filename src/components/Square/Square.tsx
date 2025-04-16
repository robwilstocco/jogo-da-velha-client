interface ISquare {
    id: number;
    winner: boolean;
    handleButton: (position: number) => void;
    children: React.ReactNode;
  }
  
  export default function Square({ id, handleButton, winner, children }: ISquare) {
    let border;
    if ([1,7].includes(id)) border = 'border-x-4 border-blue-900';
    if ([5,3].includes(id)) border = 'border-y-4 border-blue-900';
    if (id === 4) border = ' border-x-4 border-y-4 border-blue-900';

    const color = !winner ? 'bg-blue-300 hover:bg-blue-200' : 'bg-green-600 hover:bg-green-300';
  
    return (
      <button
        onClick={() => handleButton(id)}
        className={`w-16 h-16 md:w-20 md:h-20 flex justify-center items-center ${border} ${color} cursor-pointer  transition`}
      >
        {children}
      </button>
    );
  }